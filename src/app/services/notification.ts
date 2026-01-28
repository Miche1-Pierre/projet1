import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private open(
    message: string,
    panelClass: 'snackbar-error' | 'snackbar-success' | 'snackbar-info' | 'snackbar-warning',
    duration: number,
  ) {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass,
    });
  }

  success(message: string) {
    this.open(message, 'snackbar-success', 3000);
  }

  error(message: string) {
    this.open(message, 'snackbar-error', 5000);
  }

  info(message: string) {
    this.open(message, 'snackbar-info', 2000);
  }

  warning(message: string) {
    this.open(message, 'snackbar-warning', 4000);
  }
}
