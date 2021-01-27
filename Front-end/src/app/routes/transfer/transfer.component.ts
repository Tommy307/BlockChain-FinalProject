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

  @Input() receipt: Receipt;
  receiptForm: FormGroup;
  constructor(
    private settings: SettingsService,
    private fb: FormBuilder,
    private http: HttpClient,) {
    // this.receipt = this.settings.user;
    // console.log(this.user);
    this.receiptForm = this.fb.group({
      id: [0,[Validators.required]],
      debtor: ['',[Validators.required]],
      amount: [0,[Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  submit(){
    var id = this.receiptForm.get('id').value;
    var debtor = this.receiptForm.get('debtor').value;
    var amount = this.receiptForm.get('amount').value;
    var formData = {
      id : id,
      debtee : this.settings.user.name,
      debtor : debtor,
      amount : amount,
    };
    // this.http.put(this.settings.URL+":9999/user/"+this.settings.user.id,formData).subscribe(res=>{ 
    //   console.log(res);
      
    //   location.reload();
    // });
  }


}
