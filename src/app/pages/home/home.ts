import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

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
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  hoveredImg: string | null = null;
  categories: Categorie[] = [];

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
      this.categories = [
        { titre: 'S', images: [] },
        { titre: 'A', images: [] },
        { titre: 'B', images: [] },
        { titre: 'C', images: [] },
        { titre: 'D', images: [] },
        { titre: 'E', images: [] },
      ];
    }
  }

  sauvegarder() {
    localStorage.setItem('sauvegarde', JSON.stringify(this.categories));
  }

  /* Vérifier si une image est celle qui vient d'être déplacée */
  isMovedImage(categoryIdx: number, imageIdx: number): boolean {
    return this.movedImage !== null &&
      this.movedImage.destCategoryIdx === categoryIdx &&
      this.movedImage.destImageIdx === imageIdx;
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
        destImageIdx: destImageIdx
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
        destImageIdx: destImageIdx
      };

      // Réinitialiser après 2 secondes
      setTimeout(() => {
        this.movedImage = null;
      }, 2000);
    }
  }
}
