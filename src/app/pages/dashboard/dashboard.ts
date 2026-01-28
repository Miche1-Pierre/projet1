import { Component, inject, OnInit } from '@angular/core';
import { CategorieService } from '../../services/categorie';
import { NotificationService } from '../../services/notification';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  readonly categories = inject(CategorieService);
  readonly notification = inject(NotificationService);

  ngOnInit() {
    if (!this.categories.chargerDepuisLocalStorage()) {
      this.categories.getCategories().subscribe({
        next: (response) => {
          this.notification.success(response.message);
        },
        error: (error) => {
          if (error?.status === 404) {
            this.notification.error('Catégories non trouvées (404)');
          } else if (error?.status === 409) {
            this.notification.error('Conflit lors du chargement des catégories (409)');
          } else {
            this.notification.error('Erreur lors du chargement des catégories');
          }
        },
      });
    }
  }
}
