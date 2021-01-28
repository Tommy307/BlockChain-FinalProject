import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService, StartupService, TokenService } from '@core';
import { HttpClient } from "@angular/common/http";  //这里是HttpClient

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  res_data: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private token: TokenService,
    private startup: StartupService,
    private settings: SettingsService,
    private $http: HttpClient,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() { }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    var name = this.loginForm.get('username').value;
    var pass = this.loginForm.get('password').value;
    if (name == "" || pass == "") {
      return;
    }
    var formData = {
      name: name,
      password: pass,
    };
    console.log(JSON.stringify(formData));
    // 发送登录请求
    this.$http.post(this.settings.URL + ":8080/asset/login", formData).subscribe((res) => {
      this.res_data = res;
      console.log(res);
      if (this.res_data.Status != "0") {
        alert("用户名或密码出错！");
        return;
      }

      var formData = {
        name: name,
      };

      this.$http.post(this.settings.URL + ":8080/asset/asset", formData).subscribe(res => {
        console.log(res);
        this.res_data = res;
        this.settings.setUser({
          id: "0",
          name: name,
          asset: this.res_data.Asset_Value,
        })

        const { token, uid, username, asset } = {
          token: 'ng-matero-token',
          uid: 0,
          username: name,
          asset: this.res_data.Asset_Value,
        };

        // Set token info
        this.token.set({ token, uid, username, asset });
        // Regain the initial data
        this.startup.load().then(() => {
          this.router.navigateByUrl("/");
        });
      })
    })
  }
}
