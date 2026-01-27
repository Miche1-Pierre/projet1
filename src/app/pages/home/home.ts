import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';

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
  private readonly http = inject(HttpClient);

  hoveredImg: string | null = null;
  categories: Categorie[] = [];
  valeurSlider: number = 50;

  // Tracking de l'image déplacée
  movedImage: {
    sourceCategoryIdx: number;
    sourceImageIdx: number;
    destCategoryIdx: number;
    destImageIdx: number;
  } | null = null;

  ngOnInit() {
    const categoriesSauvegardeJSON = localStorage.getItem('sauvegarde');

    if (categoriesSauvegardeJSON) {
      this.categories = JSON.parse(categoriesSauvegardeJSON);
    } else {
      this.http.get<Categorie[]>('http://localhost:3000/categories').subscribe({
        next: (data) => {
          this.categories = data;
          this.sauvegarder();
          console.log("Catégories chargées depuis l'API:", data);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des catégories :', error);
        },
      });
    }
  }

  sauvegarder() {
    localStorage.setItem('sauvegarde', JSON.stringify(this.categories));
  }

  /* Charger depuis l'API */
  chargerDepuisAPI() {
    this.http.get<Categorie[]>('http://localhost:3000/categories').subscribe({
      next: (data) => {
        this.categories = data;
        this.sauvegarder();
        console.log('Catégories chargées depuis l\'API:', data);
        alert('Catégories chargées avec succès depuis l\'API !');
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories :', error);
        alert('Erreur : ' + error.message);
      }
    });
  }

  /* Vérifier si une image est celle qui vient d'être déplacée */
  isMovedImage(categoryIdx: number, imageIdx: number): boolean {
    return (
      this.movedImage !== null &&
      this.movedImage.destCategoryIdx === categoryIdx &&
      this.movedImage.destImageIdx === imageIdx
    );
  }

  inputUrlImage = '';
  selectedCategory: Categorie | null = null;

  /* ajout d'une image */
  addImageToCategory(category: Categorie) {
    if (category && this.inputUrlImage?.trim()) {
      category.images.push(this.inputUrlImage);
      this.inputUrlImage = '';
      this.sauvegarder();
    }
  }

  /* suppression d'une image */
  removeImageFromCategory(category: Categorie, imgIdx: number) {
    if (imgIdx > -1) {
      category.images.splice(imgIdx, 1);
      this.sauvegarder();
    }
  }

  /* Déplace l'image dans la catégorie précédente */
  moveImageUp(category: Categorie, imgIdx: number) {
    const catIdx = this.categories.indexOf(category);
    if (catIdx > 0 && imgIdx > -1) {
      const image = category.images[imgIdx];
      const destCategoryIdx = catIdx - 1;
      const destImageIdx = this.categories[destCategoryIdx].images.length;

      category.images.splice(imgIdx, 1);
      this.categories[destCategoryIdx].images.push(image);
      this.sauvegarder();

      // Enregistrer l'info de déplacement
      this.movedImage = {
        sourceCategoryIdx: catIdx,
        sourceImageIdx: imgIdx,
        destCategoryIdx: destCategoryIdx,
        destImageIdx: destImageIdx,
      };

      // Réinitialiser après 2 secondes
      setTimeout(() => {
        this.movedImage = null;
      }, 2000);
    }
  }

  /* Déplace l'image dans la catégorie suivante */
  moveImageDown(category: Categorie, imgIdx: number) {
    const catIdx = this.categories.indexOf(category);
    if (catIdx < this.categories.length - 1 && imgIdx > -1) {
      const image = category.images[imgIdx];
      const destCategoryIdx = catIdx + 1;
      const destImageIdx = this.categories[destCategoryIdx].images.length;

      category.images.splice(imgIdx, 1);
      this.categories[destCategoryIdx].images.push(image);
      this.sauvegarder();

      // Enregistrer l'info de déplacement
      this.movedImage = {
        sourceCategoryIdx: catIdx,
        sourceImageIdx: imgIdx,
        destCategoryIdx: destCategoryIdx,
        destImageIdx: destImageIdx,
      };

      // Réinitialiser après 2 secondes
      setTimeout(() => {
        this.movedImage = null;
      }, 2000);
    }
  }
}
