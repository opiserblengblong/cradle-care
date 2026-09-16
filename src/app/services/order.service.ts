import { Injectable, signal } from '@angular/core';
import { Order, OrderItem, OrderStatusInfo, ShippingInfo } from '../models/order.model';
import { loadJSON, saveJSON } from './storage.util';
import { NotificationService } from './notification.service';

const KEY = 'cc_orders';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _orders = signal<Order[]>(loadJSON<Order[]>(KEY, []));
  readonly orders = this._orders.asReadonly();

  constructor(private notifications: NotificationService) {}

  placeOrder(items: OrderItem[], shipping: ShippingInfo, payment: string): Order {
    const id = 'CC-' + Math.floor(100000 + Math.random() * 900000);
    const tracking = 'CCX' + Math.floor(100000000 + Math.random() * 900000000);
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const order: Order = { id, tracking, createdAt: new Date().toISOString(), payment, shipping, items, total };
    this._orders.update((list) => {
      const next = [order, ...list];
      saveJSON(KEY, next);
      return next;
    });
    this.notifications.add('Order placed', `${order.id} is confirmed. Tracking number ${order.tracking}.`, true);
    return order;
  }

  statusInfo(order: Order): OrderStatusInfo {
    const placed = new Date(order.createdAt);
    const now = new Date();
    const ageDays = (now.getTime() - placed.getTime()) / 86400000;
    let index = 0;
    if (ageDays >= 3) index = 3;
    else if (ageDays >= 2) index = 2;
    else if (ageDays >= 1) index = 1;
    const labels = ['Order placed', 'Processing', 'Shipped', 'Delivered'];
    const descriptions = [
      'We received your order and payment.',
      'Your items are being packed for shipment.',
      'Your package is on the way.',
      'Your order has been delivered.',
    ];
    return { index, label: labels[index], description: descriptions[index] };
  }
}
