package org.fisco.bcos.asset.client;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.List;
import java.util.Properties;
import org.fisco.bcos.asset.contract.*;
import org.fisco.bcos.sdk.BcosSDK;
import org.fisco.bcos.sdk.abi.datatypes.generated.tuples.generated.Tuple2;
import org.fisco.bcos.sdk.client.Client;
import org.fisco.bcos.sdk.crypto.keypair.CryptoKeyPair;
import org.fisco.bcos.sdk.model.TransactionReceipt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.io.IOUtils;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;


import com.alibaba.fastjson.*;

public class Server{

    AssetClient assetClient;

    public void init(){
        try {
            
        
        assetClient = new AssetClient();
        assetClient.initialize();
        assetClient.deployAssetAndRecordAddr();
        }
        catch (Exception e) {
            //TODO: handle exception
            e.printStackTrace();
        }
    }

    public String requestBody2String(HttpExchange httpExchange){
        String a = "";
        try {
            a = IOUtils.toString(httpExchange.getRequestBody());
             
        } catch (Exception e) {
            //TODO: handle exception
            e.printStackTrace();
        }
        return a;
    }

    public String json2String(Object obj){
        return JSON.toJSONString(obj);
    }

    public void printHeaders(HttpExchange httpExchange){
        System.out.println("addr: " + httpExchange.getRemoteAddress() +     // 客户端IP地址
                            "; protocol: " + httpExchange.getProtocol() +               // 请求协议: HTTP/1.1
                            "; method: " + httpExchange.getRequestMethod() +            // 请求方法: GET, POST 等
                            "; URI: " + httpExchange.getRequestURI());   
        // 获取请求头
        String userAgent = httpExchange.getRequestHeaders().getFirst("User-Agent");
        System.out.println("User-Agent: " + userAgent);
    }

    public void sendObject(HttpExchange httpExchange, Object json){
        try {
            byte[] respContents = JSON.toJSONString(json).getBytes("UTF-8");
    
        // 设置响应头
        httpExchange.getResponseHeaders().add("Content-Type", "application/json; charset=UTF-8");
        httpExchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        httpExchange.getResponseHeaders().add("Access-Control-Allow-Methods", "*");
		httpExchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE");
 

        // 设置响应code和内容长度
        httpExchange.sendResponseHeaders(200, respContents.length);

        // 设置响应内容
        httpExchange.getResponseBody().write(respContents);

        // 关闭处理器
        httpExchange.close();
        } catch (Exception e) {
            //TODO: handle exception
            e.printStackTrace();
        }
    }

    public void serverCreate(){
        try {
            
       
            // 创建 http 服务器, 绑定本地 8080 端口
            HttpServer httpServer = HttpServer.create(new InetSocketAddress(8080), 0);
    
            // 创上下文监听, "/" 表示匹配所有 URI 请求
            httpServer.createContext("/asset/register", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    printHeaders(httpExchange);
    
                    if (httpExchange.getRequestMethod().equals("OPTIONS")){
                        sendObject(httpExchange, "NO OPTIONS");
                        return;
                    }

                    String postString = IOUtils.toString(httpExchange.getRequestBody());
                    
    
                    JSONObject json = JSONObject.parseObject(postString);
    
                    String name = json.getString("name");
                    String pass = json.getString("password");
                    String assetVal = json.getString("asset_value");
    
                    BigInteger status = assetClient.registerAssetAccount(name, new BigInteger(assetVal));
    
                    System.out.println("JSON:" + JSON.toJSONString(json));
    
                    HashMap<String, Object> map = new HashMap<String, Object>();
                    map.put("Status", String.valueOf(status));

                    sendObject(httpExchange, map);
                }
            });

            httpServer.createContext("/asset/login", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    printHeaders(httpExchange);
                    if (httpExchange.getRequestMethod().equals("OPTIONS")){
                        sendObject(httpExchange, "NO OPTIONS");
                        return;
                    }

                    String postString = IOUtils.toString(httpExchange.getRequestBody());
                    
    
                    JSONObject json = JSONObject.parseObject(postString);
    
                    String name = json.getString("name");
                    String pass = json.getString("password");

                    Tuple2<BigInteger,BigInteger> tuple = assetClient.queryAssetAmount(name);

                    BigInteger status = tuple.getValue1();

    
                    System.out.println("JSON:" + JSON.toJSONString(json));
    
                    HashMap<String, Object> map = new HashMap<String, Object>();
                    map.put("Status", String.valueOf(status));

                    sendObject(httpExchange, map);
                }
            });

            httpServer.createContext("/asset/asset", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    printHeaders(httpExchange);
        
                    if (httpExchange.getRequestMethod().equals("OPTIONS")){
                        
                        sendObject(httpExchange, "NO OPTIONS");
                        return;
                    }

                    String postString = IOUtils.toString(httpExchange.getRequestBody());
                    
    
                    JSONObject json = JSONObject.parseObject(postString);

                    System.out.println("JSON:" + JSON.toJSONString(json));
    
                    String name = json.getString("name");
                    //String pass = json.getString("password");

                    Tuple2<BigInteger,BigInteger> tuple = assetClient.queryAssetAmount(name);

                    BigInteger status = tuple.getValue1();
                    BigInteger val = tuple.getValue2();
                  
                    HashMap<String, Object> map = new HashMap<String, Object>();
                    map.put("Status", String.valueOf(status));
                    map.put("Asset_Value", String.valueOf(val));

                    sendObject(httpExchange, map);
                }
            });
    
            httpServer.start();
    
        } catch (Exception e) {
            //TODO: handle exception
            e.printStackTrace();
        }
    }
    public static void main(String[] args) {

        Server server = new Server();
        server.init();
        server.serverCreate();


    }

    public static Map<String,String> formData2Dic(String formData ) {
        Map<String,String> result = new HashMap<>();
        if(formData== null || formData.trim().length() == 0) {
            return result;
        }
        final String[] items = formData.split("&");
        Arrays.stream(items).forEach(item ->{
            final String[] keyAndVal = item.split("=");
            if( keyAndVal.length == 2) {
                try{
                    final String key = URLDecoder.decode( keyAndVal[0],"utf8");
                    final String val = URLDecoder.decode( keyAndVal[1],"utf8");
                    result.put(key,val);
                }catch (UnsupportedEncodingException e) {}
            }
        });
        return result;
    }


}