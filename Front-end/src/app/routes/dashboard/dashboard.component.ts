import { Component, OnInit, Input,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Receipt } from '@core';
import { SettingsService} from '@core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  receiptForm: FormGroup;

  res_data: any;

  constructor(
    private settings: SettingsService,
    private fb: FormBuilder,
    private http: HttpClient,) {
    this.receiptForm = this.fb.group({
      debtor: ['',[Validators.required]],
      amount: ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  submit(){
    var debtee = this.receiptForm.get('debtor').value;
    var amount = this.receiptForm.get('amount').value;
    var formData = {
      debtee_account : debtee,
      debtor_account : this.settings.user.name,
      amount : amount,
    };
    this.http.post(this.settings.URL+":8080/receipt/make",formData).subscribe(res=>{ 
      console.log(res);
      this.res_data = res;

      if(this.res_data.Status == "0"){
        alert("创建成功");
        this.receiptForm.reset();
      } else{
        alert("创建失败，请检查信息输入是否有误！");
      }
      
      // location.reload();
    });
  }

}
