package org.fisco.bcos.asset.client;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.List;
import java.util.Properties;
import org.fisco.bcos.asset.contract.Receipt;
import org.fisco.bcos.sdk.BcosSDK;
import org.fisco.bcos.sdk.abi.datatypes.generated.tuples.generated.*;
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

public class ReceiptClient{
    static Logger logger = LoggerFactory.getLogger(ReceiptClient.class);

  private BcosSDK bcosSDK;
  private Client client;
  private CryptoKeyPair cryptoKeyPair;

  public void initialize() throws Exception {
    @SuppressWarnings("resource")
    ApplicationContext context =
        new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
    bcosSDK = context.getBean(BcosSDK.class);
    client = bcosSDK.getClient(1);
    cryptoKeyPair = client.getCryptoSuite().createKeyPair();
    client.getCryptoSuite().setCryptoKeyPair(cryptoKeyPair);
    logger.debug("create client for group1, account address is " + cryptoKeyPair.getAddress());
  }

  public void deployReceiptAndRecordAddr() {

    try {
      Receipt receipt = Receipt.deploy(client, cryptoKeyPair);
      System.out.println(
          " deploy Receipt success, contract address is " + receipt.getContractAddress());

      recordReceiptAddr(receipt.getContractAddress());
    } catch (Exception e) {
      // TODO Auto-generated catch block
      // e.printStackTrace();
      System.out.println(" deploy Receipt contract failed, error message is  " + e.getMessage());
    }
  }

  public void recordReceiptAddr(String address) throws FileNotFoundException, IOException {
    Properties prop = new Properties();
    prop.setProperty("address", address);
    final Resource contractResource = new ClassPathResource("contract1.properties");
    FileOutputStream fileOutputStream = new FileOutputStream(contractResource.getFile());
    prop.store(fileOutputStream, "contract address");
  }

  public String loadReceiptAddr() throws Exception {
    // load Receipt contact address from contract.properties
    Properties prop = new Properties();
    final Resource contractResource = new ClassPathResource("contract1.properties");
    prop.load(contractResource.getInputStream());

    String contractAddress = prop.getProperty("address");
    if (contractAddress == null || contractAddress.trim().equals("")) {
      throw new Exception(" load Receipt contract address failed, please deploy it first. ");
    }
    logger.info(" load Receipt address from contract.properties, address is {}", contractAddress);
    return contractAddress;
  }
  public BigInteger make(String id, String debtor_account, String debtee_account, BigInteger amount) {
    try {
      String contractAddress = loadReceiptAddr();
       Receipt receipt =  Receipt.load(contractAddress, client, cryptoKeyPair);
       TransactionReceipt makeReceipt = receipt.make(id, debtor_account, debtee_account, amount);

       List<Receipt.MakeEventEventResponse> response = receipt.getMakeEventEvents(makeReceipt);

       if (!response.isEmpty()) {
        if (response.get(0).ret.compareTo(new BigInteger("0")) == 0) {
          System.out.printf(
              " make receipt account success => debtor: %s, debtee: %s, value: %s \n", debtor_account, debtee_account ,String.valueOf(amount));
        } else {
          System.out.printf(
              " make receipt failed, ret code is %s \n", response.get(0).ret.toString());
        }
      } else {
        System.out.println(" event log not found, maybe transaction not exec. ");
      }
      return response.get(0).ret;
    } catch (Exception e) {
      // TODO Auto-generated catch block
      // e.printStackTrace();

      logger.error("make  exception, error message is {}", e.getMessage());
      System.out.printf(" make   failed, error message is %s\n", e.getMessage());
      return null;
    }
  }

  public Tuple4<BigInteger, String, String, BigInteger> select_(String id)  {
    try {
      String contractAddress = loadReceiptAddr();
       Receipt receipt =  Receipt.load(contractAddress, client, cryptoKeyPair);
       Tuple4<BigInteger, String, String, BigInteger> result = receipt.select_(id);
      if (result.getValue1().compareTo(new BigInteger("0")) == 0) {
        System.out.printf(" select_ success debato_account %s, debatee_account  %s \n", result.getValue2(), result.getValue3());
      } else {
        System.out.printf(" %s receipt  is not exist \n", id);
      }
      return result;
    } catch (Exception e) {
      // TODO Auto-generated catch block
      // e.printStackTrace();
      logger.error(" queryAssetAmount exception, error message is {}", e.getMessage());

      System.out.printf(" query asset account failed, error message is %s\n", e.getMessage());
      return null;
    }
  }

  public BigInteger transfer(String id, String from_account, String to_account, BigInteger amount, String id_new) {
    try {
      String contractAddress = loadReceiptAddr();
       Receipt receipt =  Receipt.load(contractAddress, client, cryptoKeyPair);
       TransactionReceipt makeReceipt = receipt.transfer(id, from_account, to_account, amount, id_new);

       List<Receipt.TransferEventEventResponse> response = receipt.getTransferEventEvents(makeReceipt);

       if (!response.isEmpty()) {
        if (response.get(0).ret.compareTo(new BigInteger("0")) == 0) {
          System.out.printf(
              " transfer receipt account success => from: %s, to: %s, value: %s \n", from_account, to_account ,String.valueOf(amount));
        } else {
          System.out.printf(
              " transfer receipt failed, ret code is %s \n", response.get(0).ret.toString());
        }
      } else {
        System.out.println(" event log not found, maybe transaction not exec. ");
      }
      return response.get(0).ret;
    } catch (Exception e) {
      // TODO Auto-generated catch block
      // e.printStackTrace();

      logger.error("transfer  exception, error message is {}", e.getMessage());
      System.out.printf(" transfer   failed, error message is %s\n", e.getMessage());
      return null;
    }
  }

  public BigInteger pay(String id) {
    try {
      String contractAddress = loadReceiptAddr();
       Receipt receipt =  Receipt.load(contractAddress, client, cryptoKeyPair);
       TransactionReceipt makeReceipt = receipt.pay(id);

       List<Receipt.PayEventEventResponse> response = receipt.getPayEventEvents(makeReceipt);

       if (!response.isEmpty()) {
        if (response.get(0).ret.compareTo(new BigInteger("0")) == 0) {
          System.out.printf(
              " pay receipt  success => id: %s",  id);
        } else {
          System.out.printf(
              " pay receipt failed, ret code is %s \n", response.get(0).ret.toString());
        }
      } else {
        System.out.println(" event log not found, maybe transaction not exec. ");
      }
      return response.get(0).ret;
    } catch (Exception e) {
      // TODO Auto-generated catch block
      // e.printStackTrace();

      logger.error("pay  exception, error message is {}", e.getMessage());
      System.out.printf(" pay   failed, error message is %s\n", e.getMessage());
      return null;
    }
  }

  public Tuple2<String, String> getRecipts(String account) {
    try {
      String contractAddress = loadReceiptAddr();
       Receipt receipt =  Receipt.load(contractAddress, client, cryptoKeyPair);
       Tuple2<String, String> result = receipt.selectAccountName(account);
       System.out.println(result);
       
      return result;
    } catch (Exception e) {
      // TODO Auto-generated catch block
      // e.printStackTrace();
      logger.error(" queryAssetAmount exception, error message is {}", e.getMessage());

      System.out.printf(" query asset account failed, error message is %s\n", e.getMessage());
      return null;
    }
  }

  
}
