import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from "@angular/common/http";  //这里是HttpClient
import { ChangeDetectorRef } from "@angular/core";
import { SettingsService } from '@core';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent implements OnInit {
  receipts = [];

  res_data: any;

  receipt_id: [];

  res_receipt: any;

  res_content: any;

  pageIndex = 1;

  constructor(
    private router: Router,
    private $http: HttpClient,
    private settings: SettingsService,
    private cd: ChangeDetectorRef,
  ) {

    // this.receipt = this.settings.receipt;
    // if (this.receipt.flag == false) {
    //   let req = new HttpParams().set('page', this.pageIndex+"").set('eachPage',"5");
    var formData = {
      account: this.settings.user.name,
    };
    this.$http.post(this.settings.URL + ":8080/receipt/selectAccount", formData).subscribe(res => {
      this.res_data = res;
      this.receipt_id = JSON.parse(this.res_data.Array);
      console.log(this.receipt_id);
      this.receipts = [];
      for(var i=0;i<this.receipt_id.length;++i){
        this.getReceipt(this.receipt_id[i]);
        // console.log(this.receipt_id[i]);
        
      }
      // this.receipts.forEach((val,ind) => {
      //   var formData = {
      //     id: val,
      //   };
      //   this.$http.post(this.settings.URL + ":8080/receipt/select", formData).subscribe(res =>{
      //     console.log(res);
      //   })
      // })
      // this.receipts = [
      //   {
      //     id: 1,
      //     debtee: "car_compony",
      //     debtor: "hub_compony",
      //     amount: 1000,
      //   },
      //   {
      //     id: 2,
      //     debtee: "car_compony",
      //     debtor: "hub_compony",
      //     amount: 2000,
      //   }
      // ];
      // this.cd.detectChanges();
    })
    // }
    // else {
    //   let req = this.receipt.search;
    //   this.$http.get(this.settings.URL+":9999/article/title/"+req).subscribe(res=>{
    //     this.res_data = this.receipt.receipt;
    //     this.receipts = this.receipt.receipt;
    //     this.cd.detectChanges();
    //   })
    // }

  }

  ngOnInit(): void {
    // var formData = {
    //   id: this.settings.user.name,
    // };

    // this.$http.post(this.settings.URL + ":8080/receipt/select", formData).subscribe(res => {
    //   this.res_data = res;
    //   this.receipts = this.res_data.Content;
    //   console.log(this.receipts);
    //   // this.receipts = [
    //   //   {
    //   //     id: 1,
    //   //     debtee: "car_compony",
    //   //     debtor: "hub_compony",
    //   //     amount: 1000,
    //   //   },
    //   //   {
    //   //     id: 2,
    //   //     debtee: "car_compony",
    //   //     debtor: "hub_compony",
    //   //     amount: 2000,
    //   //   }
    //   // ];
    //   // this.cd.detectChanges();
    // })
  }

  getReceipt(id):void{
    var formData = {
      id: id,
    };
    this.$http.post(this.settings.URL + ":8080/receipt/select", formData).subscribe(res =>{
      console.log(res);
      this.res_receipt = res;
      this.res_content = JSON.parse(this.res_receipt.Content);
      if(this.res_receipt.Status == "0"){
        console.log(this.res_content);
        var rec = {
          id: formData.id,
          debtee: this.res_content.value2,
          debtor: this.res_content.value3,
          amount: this.res_content.value4,
        }
        this.receipts.push(rec);
        console.log(this.receipts);
      }
    })
  }

}
