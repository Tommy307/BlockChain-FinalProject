import { Component } from '@angular/core';
import { SettingsService, User } from '@core';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel" fxLayout="column" fxLayoutAlign="center center">
      <h4 class="matero-user-panel-name">{{ user.name }}</h4>
      <h4 class="matero-user-panel-name">资产：{{ user.asset }}</h4>
      <div class="matero-user-panel-icons">
        <a routerLink="/auth/login" mat-icon-button>
          <mat-icon>exit_to_app</mat-icon>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent {
  user: User;

  constructor(settings: SettingsService) {
    this.user = settings.user;
  }
}
