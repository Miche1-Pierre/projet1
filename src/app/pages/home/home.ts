import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';
import { CategorieService } from '../../services/categorie';

type Categorie = { titre: string; images: string[] };

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    CommonModule,
    FormsModule,
    MatSliderModule,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  readonly notification = inject(NotificationService);
  readonly categorie = inject(CategorieService);

  hoveredImg = signal<string | null>(null);
  valeurSlider = signal<number>(50);

  // Tracking de l'image déplacée
  movedImage = signal<{
    sourceCategoryIdx: number;
    sourceImageIdx: number;
    destCategoryIdx: number;
    destImageIdx: number;
  } | null>(null);

  ngOnInit() {
    if (!this.categorie.chargerDepuisLocalStorage()) {
      this.categorie.getCategories().subscribe({
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

  /* Charger depuis l'API */
  chargerDepuisAPI() {
    this.categorie.getCategories().subscribe({
      next: (response) => {
        this.notification.success(response.message);
      },
      error: (error) => {
        if (error?.status === 404) {
          this.notification.error('Catégories non trouvées (404)');
        } else if (error?.status === 409) {
          this.notification.error('Conflit lors du chargement des catégories (409)');
        } else {
          const errorMsg = error?.error?.message || error?.message || 'Erreur inconnue';
          this.notification.error(`Erreur : ${errorMsg}`);
        }
      },
    });
  }

  /* Vérifier si une image est celle qui vient d'être déplacée */
  isMovedImage(categoryIdx: number, imageIdx: number): boolean {
    const moved = this.movedImage();
    return (
      moved !== null && moved.destCategoryIdx === categoryIdx && moved.destImageIdx === imageIdx
    );
  }

  inputUrlImage = '';
  selectedCategory: Categorie | null = null;

  /* ajout d'une image */
  addImageToCategory(category: Categorie) {
    if (category && this.inputUrlImage?.trim()) {
      const url = this.inputUrlImage.trim();
      this.categorie.postImage(category.titre, url).subscribe({
        next: (response) => {
          this.inputUrlImage = '';
          const message = response?.message || 'Image ajoutée avec succès';
          this.notification.success(message);
        },
        error: (error) => {
          if (error?.status === 404) {
            this.notification.error('Catégorie non trouvée (404)');
          } else if (error?.status === 409) {
            this.notification.error("Conflit lors de l'ajout de l'image (409)");
          } else {
            const errorMsg = error?.error?.message || error?.message || "Erreur lors de l'ajout";
            this.notification.error(errorMsg);
          }
        },
      });
    }
  }

  /* suppression d'une image */
  removeImageFromCategory(category: Categorie, imgIdx: number) {
    if (imgIdx > -1) {
      const imageUrl = category.images[imgIdx];

      this.categorie.deleteImage(category.titre, imageUrl).subscribe({
        next: (response) => {
          const message = response?.message || 'Image supprimée avec succès';
          this.notification.success(message);
        },
        error: (error) => {
          if (error?.status === 404) {
            this.notification.error('Image ou catégorie non trouvée (404)');
          } else if (error?.status === 409) {
            this.notification.error("Conflit lors de la suppression de l'image (409)");
          } else {
            const errorMsg =
              error?.error?.message || error?.message || 'Erreur lors de la suppression';
            this.notification.error(errorMsg);
          }
        },
      });
    }
  }

  /* Déplace l'image dans la catégorie précédente */
  moveImageUp(category: Categorie, imgIdx: number) {
    const categories = this.categorie.categories();
    const catIdx = categories.indexOf(category);
    if (catIdx > 0 && imgIdx > -1) {
      const image = category.images[imgIdx];
      const destCategoryIdx = catIdx - 1;
      const destImageIdx = categories[destCategoryIdx].images.length;

      this.categorie
        .moveImage(image, category.titre, categories[destCategoryIdx].titre, 'up')
        .subscribe({
          next: (response) => {
            // Enregistrer l'info de déplacement
            this.movedImage.set({
              sourceCategoryIdx: catIdx,
              sourceImageIdx: imgIdx,
              destCategoryIdx: destCategoryIdx,
              destImageIdx: destImageIdx,
            });

            // Réinitialiser après 2 secondes
            setTimeout(() => {
              this.movedImage.set(null);
            }, 2000);

            const message = response?.message || 'Image déplacée avec succès';
            this.notification.info(message);
          },
          error: (error) => {
            if (error?.status === 404) {
              this.notification.error('Image ou catégorie non trouvée (404)');
            } else if (error?.status === 409) {
              this.notification.error("Conflit lors du déplacement de l'image (409)");
            } else {
              const errorMsg =
                error?.error?.message || error?.message || 'Erreur lors du déplacement';
              this.notification.error(errorMsg);
            }
          },
        });
    }
  }

  /* Déplace l'image dans la catégorie suivante */
  moveImageDown(category: Categorie, imgIdx: number) {
    const categories = this.categorie.categories();
    const catIdx = categories.indexOf(category);
    if (catIdx < categories.length - 1 && imgIdx > -1) {
      const image = category.images[imgIdx];
      const destCategoryIdx = catIdx + 1;
      const destImageIdx = categories[destCategoryIdx].images.length;

      this.categorie
        .moveImage(image, category.titre, categories[destCategoryIdx].titre, 'down')
        .subscribe({
          next: (response) => {
            // Enregistrer l'info de déplacement
            this.movedImage.set({
              sourceCategoryIdx: catIdx,
              sourceImageIdx: imgIdx,
              destCategoryIdx: destCategoryIdx,
              destImageIdx: destImageIdx,
            });

            // Réinitialiser après 2 secondes
            setTimeout(() => {
              this.movedImage.set(null);
            }, 2000);

            const message = response?.message || 'Image déplacée avec succès';
            this.notification.info(message);
          },
          error: (error) => {
            if (error?.status === 404) {
              this.notification.error('Image ou catégorie non trouvée (404)');
            } else if (error?.status === 409) {
              this.notification.error("Conflit lors du déplacement de l'image (409)");
            } else {
              const errorMsg =
                error?.error?.message || error?.message || 'Erreur lors du déplacement';
              this.notification.error(errorMsg);
            }
          },
        });
    }
  }
}
