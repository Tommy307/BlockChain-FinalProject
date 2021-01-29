import { Component, OnInit, Input,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Receipt } from '@core';
import { SettingsService} from '@core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  receiptForm: FormGroup;

  res_data: any;

  constructor(
    private settings: SettingsService,
    private fb: FormBuilder,
    private http: HttpClient,) {
    // this.receipt = this.settings.user;
    // console.log(this.user);
    this.receiptForm = this.fb.group({
      id: ['',[Validators.required]],
      debtor: ['',[Validators.required]],
      amount: ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  submit(){
    var id = this.receiptForm.get('id').value;
    var debtor = this.receiptForm.get('debtor').value;
    var amount = this.receiptForm.get('amount').value;
    var formData = {
      receipt_number : id,
      from_account : this.settings.user.name,
      to_account : debtor,
      amount : amount,
    };
    this.http.post(this.settings.URL+":8080/receipt/transfer",formData).subscribe(res=>{ 
      console.log(res);
      this.res_data = res;

      if(this.res_data.Status == "0"){
        alert("转移成功");
        this.receiptForm.reset();
      } else{
        alert("转移失败，请检查信息输入是否有误！");
      }
      
      // location.reload();
    });
  }


}
