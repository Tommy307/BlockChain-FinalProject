import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,HttpParams } from "@angular/common/http";  //这里是HttpClient
import { ChangeDetectorRef } from "@angular/core";
import { SettingsService } from '@core';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent implements OnInit {
  receipts = [];

  res_data : any;

  pageIndex = 1;
  
  constructor(
    private router: Router,
    private $http: HttpClient,
    private settings: SettingsService,
    private cd:ChangeDetectorRef,
  ) {  
    
    // this.receipt = this.settings.receipt;
    // if (this.receipt.flag == false) {
    //   let req = new HttpParams().set('page', this.pageIndex+"").set('eachPage',"5");
    //   this.$http.get(this.settings.URL+":9999/article/",{params:req}).subscribe(res=>{
    //     this.res_data = res;
    //     this.receipts = this.res_data.Message;
    //     // console.log(this.receipts);
    //     this.cd.detectChanges();
    //   })
    // }
    // else {
    //   let req = this.receipt.search;
    //   this.$http.get(this.settings.URL+":9999/article/title/"+req).subscribe(res=>{
    //     this.res_data = this.receipt.receipt;
    //     this.receipts = this.receipt.receipt;
    //     this.cd.detectChanges();
    //   })
    // }
    this.receipts = [
      {
        id: 1,
        debtee: "car_compony",
        debtor: "hub_compony",
        amount: 1000,
      },
      {
        id: 2,
        debtee: "car_compony",
        debtor: "hub_compony",
        amount: 2000,
      }
    ];
    
  }

  ngOnInit(): void {
  }
}
