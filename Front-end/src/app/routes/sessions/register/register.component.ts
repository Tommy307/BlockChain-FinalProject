import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService, StartupService, TokenService } from '@core';
import { HttpClient } from "@angular/common/http";  //这里是HttpClient

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  res_data : any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private settings: SettingsService,
    private token: TokenService,
    private $http: HttpClient,
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [this.confirmValidator]],
    });
  }

  ngOnInit() {}

  register(){
    var name = this.registerForm.get('username').value;
    var pass = this.registerForm.get('password').value;
  
    var formData = {
      name : name,
      password : pass,
      asset_value : 0,
    };
    // console.log(JSON.stringify(formData));
    console.log("submit to register.");
    // 发送注册请求
    this.$http.post(this.settings.URL+":8080/asset/register",formData).subscribe(res=>{ 
      console.log(res); 
      this.res_data = res;
      console.log(this.res_data);
      if(this.res_data.Status == "0"){
        var formData = {
          name : name,
        };
        this.$http.post(this.settings.URL+":8080/asset/asset",formData).subscribe(res=>{
          console.log(res);
          this.res_data = res;
          const { token, uid, username, asset } = {
            token: 'ng-matero-token',
            uid: 0,
            username: name,
            asset: this.res_data.Asset_Value,
          };
  
          // Set token info
          this.token.set({ token, uid, username, asset });
          this.settings.setUser({
            id: "0",
            name: name,
            asset: this.res_data.Asset_Value,
          })
          this.router.navigateByUrl("/login");
        })
        this.router.navigateByUrl("/login");
      } else {
        alert("用户名已存在");
      }
     });
  }

  confirmValidator = (control: FormControl): { [k: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { error: true, confirm: true };
    }
    return {};
  };
}
