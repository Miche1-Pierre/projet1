import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  readonly categories = signal<Categorie[]>([]);
  http = inject(HttpClient);

  private sauvegarder() {
    localStorage.setItem('sauvegarde', JSON.stringify(this.categories()));
  }

  chargerDepuisLocalStorage() {
    const categoriesSauvegardeJSON = localStorage.getItem('sauvegarde');
    if (categoriesSauvegardeJSON) {
      this.categories.set(JSON.parse(categoriesSauvegardeJSON));
      return true;
    }
    return false;
  }

  getCategories(): Observable<ApiResponse> {
    return this.http.get<Categorie[]>('http://localhost:3004/categories').pipe(
      tap((data) => {
        this.categories.set(data);
        this.sauvegarder();
      }),
      map((data) => ({ success: true, message: "Catégories chargées depuis l'API", data })),
    );
  }

  postCategorie(titre: string) {
    return this.http.post('http://localhost:3004/categorie', { titre });
  }

  deleteCategorie(titre: string) {
    return this.http.delete('http://localhost:3004/categorie', { body: { titre } });
  }

  postImage(titreCategorie: string, url: string): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>('http://localhost:3004/images', {
        categorie: titreCategorie,
        url,
      })
      .pipe(
        tap(() => {
          const categories = this.categories();
          const category = categories.find((c) => c.titre === titreCategorie);
          if (category) {
            category.images.push(url);
            this.categories.set([...categories]);
            this.sauvegarder();
          }
        }),
      );
  }

  deleteImage(titreCategorie: string, url: string): Observable<ApiResponse> {
    return this.http
      .delete<ApiResponse>('http://localhost:3004/images', {
        body: { categorie: titreCategorie, url },
      })
      .pipe(
        tap(() => {
          const categories = this.categories();
          const category = categories.find((c) => c.titre === titreCategorie);
          if (category) {
            const imgIdx = category.images.indexOf(url);
            if (imgIdx > -1) {
              category.images.splice(imgIdx, 1);
              this.categories.set([...categories]);
              this.sauvegarder();
            }
          }
        }),
      );
  }

  moveImage(
    imageUrl: string,
    sourceCat: string,
    destCat: string,
    direction: 'up' | 'down',
  ): Observable<ApiResponse> {
    return this.http
      .patch<ApiResponse>('http://localhost:3004/images/move', {
        imageUrl,
        sourceCat,
        destCat,
        direction,
      })
      .pipe(
        tap(() => {
          const categories = this.categories();
          const sourceCategory = categories.find((c) => c.titre === sourceCat);
          const destCategory = categories.find((c) => c.titre === destCat);

          if (sourceCategory && destCategory) {
            const imgIdx = sourceCategory.images.indexOf(imageUrl);
            if (imgIdx > -1) {
              sourceCategory.images.splice(imgIdx, 1);
              destCategory.images.push(imageUrl);
              this.categories.set([...categories]);
              this.sauvegarder();
            }
          }
        }),
      );
  }
}
