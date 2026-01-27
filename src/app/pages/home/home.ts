import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Categorie } from '../../types/categorie';

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

export class Home {
  hoveredImg: string | null = null;
  categories: Categorie[] = [];

  inputUrlImage = '';
  selectedCategory: Categorie | null = null;

  /* ajout d'une image */
  addImageToCategory(category: Categorie) {
    if (category && this.inputUrlImage?.trim()) {
      category.images.push(this.inputUrlImage);
      this.inputUrlImage = '';
    }
  }

  /* suppression d'une image */
  removeImageFromCategory(category: Categorie, imgIdx: number) {
    if (imgIdx > -1) {
      category.images.splice(imgIdx, 1);
    }
  }

  /* Déplace l'image dans la catégorie précédente */
  moveImageUp(category: Categorie, imgIdx: number) {
    const catIdx = this.categories.indexOf(category);
    if (catIdx > 0 && imgIdx > -1) {
      const image = category.images[imgIdx];
      category.images.splice(imgIdx, 1);
      this.categories[catIdx - 1].images.push(image);
    }
  }

  /* Déplace l'image dans la catégorie suivante */
  moveImageDown(category: Categorie, imgIdx: number) {
    const catIdx = this.categories.indexOf(category);
    if (catIdx < this.categories.length - 1 && imgIdx > -1) {
      const image = category.images[imgIdx];
      category.images.splice(imgIdx, 1);
      this.categories[catIdx + 1].images.push(image);
    }
  }
}
