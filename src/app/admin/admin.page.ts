import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Admin Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="4">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Total Revenue</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <h2>{{ revenue || 0 | currency }}</h2>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="4">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Orders</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <h2>{{ totalOrders || 0 }}</h2>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="4">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Products</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <h2>{{ totalProducts || 0 }}</h2>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Recent Orders</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list *ngIf="orders.length; else loading">
                  <ion-item *ngFor="let order of orders">
                    <ion-label>
                      <h3>Order #{{ order.id }}</h3>
                      <p>{{ order.status }}</p>
                    </ion-label>
                  </ion-item>
                </ion-list>

                <ng-template #loading>
                  <ion-spinner></ion-spinner>
                </ng-template>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class AdminPage implements OnInit {
  revenue = 0;
  totalOrders = 0;
  totalProducts = 0;
  orders: any[] = [];

  constructor(private api: ApiService) {}

  async ngOnInit() {
    try {
      const dashboard = await this.api.get<any>('/admin/dashboard');
      this.revenue = dashboard.revenue || 0;
      this.totalOrders = dashboard.totalOrders || 0;
      this.totalProducts = dashboard.totalProducts || 0;
      this.orders = dashboard.orders || [];
    } catch (error) {
      console.error('Admin dashboard error', error);
    }
  }
}
