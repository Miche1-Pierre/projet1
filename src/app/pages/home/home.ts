import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
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

  hoveredImg = signal<string | null>(null);
  categories = signal<Categorie[]>([]);
  valeurSlider = signal<number>(50);

  // Tracking de l'image déplacée
  movedImage = signal<{
    sourceCategoryIdx: number;
    sourceImageIdx: number;
    destCategoryIdx: number;
    destImageIdx: number;
  } | null>(null);

  ngOnInit() {
    const categoriesSauvegardeJSON = localStorage.getItem('sauvegarde');

    if (categoriesSauvegardeJSON) {
      this.categories.set(JSON.parse(categoriesSauvegardeJSON));
    } else {
      this.http.get<Categorie[]>('http://localhost:3000/categories').subscribe({
        next: (data) => {
          this.categories.set(data);
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
    localStorage.setItem('sauvegarde', JSON.stringify(this.categories()));
  }

  /* Charger depuis l'API */
  chargerDepuisAPI() {
    this.http.get<Categorie[]>('http://localhost:3000/categories').subscribe({
      next: (data) => {
        this.categories.set(data);
        this.sauvegarder();
        console.log("Catégories chargées depuis l'API:", data);
        alert("Catégories chargées avec succès depuis l'API !");
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories :', error);
        alert('Erreur : ' + error.message);
      },
    });
  }

  /* Vérifier si une image est celle qui vient d'être déplacée */
  isMovedImage(categoryIdx: number, imageIdx: number): boolean {
    const moved = this.movedImage();
    return (
      moved !== null &&
      moved.destCategoryIdx === categoryIdx &&
      moved.destImageIdx === imageIdx
    );
  }

  inputUrlImage = '';
  selectedCategory: Categorie | null = null;

  /* ajout d'une image */
  addImageToCategory(category: Categorie) {
    if (category && this.inputUrlImage?.trim()) {
      const payload = {
        url: this.inputUrlImage.trim(),
        categorie: category.titre,
      };

      this.http.post('http://localhost:3000/images', payload).subscribe({
        next: (response) => {
          category.images.push(this.inputUrlImage.trim());
          this.inputUrlImage = '';

          // Mettre à jour le signal pour déclencher la réactivité
          this.categories.set([...this.categories()]);
          this.sauvegarder();
          console.log('Image ajoutée avec succès:', response);
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout de l'image :", error);
          alert('Erreur : ' + error.message);
        },
      });
    }
  }

  /* suppression d'une image */
  removeImageFromCategory(category: Categorie, imgIdx: number) {
    if (imgIdx > -1) {
      category.images.splice(imgIdx, 1);
      this.categories.set([...this.categories()]);
      this.sauvegarder();
    }
  }

  /* Déplace l'image dans la catégorie précédente */
  moveImageUp(category: Categorie, imgIdx: number) {
    const categories = this.categories();
    const catIdx = categories.indexOf(category);
    if (catIdx > 0 && imgIdx > -1) {
      const image = category.images[imgIdx];
      const destCategoryIdx = catIdx - 1;
      const destImageIdx = categories[destCategoryIdx].images.length;

      category.images.splice(imgIdx, 1);
      categories[destCategoryIdx].images.push(image);
      
      this.categories.set([...categories]);
      this.sauvegarder();

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
    }
  }

  /* Déplace l'image dans la catégorie suivante */
  moveImageDown(category: Categorie, imgIdx: number) {
    const categories = this.categories();
    const catIdx = categories.indexOf(category);
    if (catIdx < categories.length - 1 && imgIdx > -1) {
      const image = category.images[imgIdx];
      const destCategoryIdx = catIdx + 1;
      const destImageIdx = categories[destCategoryIdx].images.length;

      category.images.splice(imgIdx, 1);
      categories[destCategoryIdx].images.push(image);
      
      this.categories.set([...categories]);
      this.sauvegarder();

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
    }
  }
}
