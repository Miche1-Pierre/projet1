import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  styleUrl: './home.scss',
})
export class Home {
  hoveredImg: string | null = null;
  categories = [
    {
      titre: 'S',
      images: [
        'https://imgs.search.brave.com/U51WOc46hZ310-TDNDn9Ee1pcYM2AUiG3Nd1Oeb_0K8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzAy/NjcvODk3MC83ODU0/L2ZpbGVzL21lbWUt/Y2hhdC1kcm9sZS0x/NF80ODB4NDgwLmpw/Zz92PTE3MzgxNDI1/MTU',
        'https://imgs.search.brave.com/rv7I0OiEadfxCRX-5MXfTAOow_7gjetwdfAby8wJqdM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9paDEu/cmVkYnViYmxlLm5l/dC9pbWFnZS41NjEz/NTA5NjI2LjQ1MjUv/ZnBvc3RlcixzbWFs/bCx3YWxsX3RleHR1/cmUsc3F1YXJlX3By/b2R1Y3QsNjAweDYw/MC5qcGc',
        'https://imgs.search.brave.com/6qGRNMuccEQrM7wyhOqeTYS6yDmkG5Tbx-VU1yLifE8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/aTF6N2tpZ25iYmxh/MS5qcGc_d2lkdGg9/NjQwJmNyb3A9c21h/cnQmYXV0bz13ZWJw/JnM9YjAwOWE2YTEw/YmUzZmJlNzJjODI4/Yzg0YjQ5NzBjNmRk/YTE2Y2U0Mw',
      ],
    },
    {
      titre: 'A',
      images: [
        'https://imgs.search.brave.com/1lRVUOPiX5T-6V0FV6cQi1jvdOJN4bgA2SbziZWG-GY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9paDEu/cmVkYnViYmxlLm5l/dC9pbWFnZS40Mzc2/MDUzNDkyLjM0NjAv/ZnBvc3RlcixzbWFs/bCx3YWxsX3RleHR1/cmUsc3F1YXJlX3By/b2R1Y3QsNjAweDYw/MC51MS5qcGc',
      ],
    },
    {
      titre: 'B',
      images: [
        'https://imgs.search.brave.com/JhnykBcbGBzQMRoACRQZK94_5V2yv_MonaAU3ajZo0A/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9paDEu/cmVkYnViYmxlLm5l/dC9pbWFnZS4zMjA1/NzY4MjQ4LjAyMjEv/ZnBvc3RlcixzbWFs/bCx3YWxsX3RleHR1/cmUsc3F1YXJlX3By/b2R1Y3QsNjAweDYw/MC5qcGc',
      ],
    },
    {
      titre: 'C',
      images: [
        'https://imgs.search.brave.com/2LK4sjP-lVtZVFU61OODt24sQDxwerhwfMDXGmz5ptA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9paDEu/cmVkYnViYmxlLm5l/dC9pbWFnZS41ODUz/MjE5NTc4LjI5NjAv/c3Qsc21hbGwsNTA3/eDUwNy1wYWQsNjAw/eDYwMCxmOGY4Zjgu/anBn',
      ],
    },
    {
      titre: 'D',
      images: [
        'https://imgs.search.brave.com/MI6fi6SYqpVzJmPjeeLunDWN_QSLYNz-MWWgzMaZq3o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9paDEu/cmVkYnViYmxlLm5l/dC9pbWFnZS41NjEz/NTA1MzM2LjQ0MDgv/ZnBvc3RlcixzbWFs/bCx3YWxsX3RleHR1/cmUsc3F1YXJlX3By/b2R1Y3QsNjAweDYw/MC5qcGc',
      ],
    },
  ];

  inputUrlImage = '';
  selectedCategory: any = null;

  /* ajout d'une image */
  addImageToCategory(category: any) {
    if (category && this.inputUrlImage?.trim()) {
      category.images.push(this.inputUrlImage);
      this.inputUrlImage = '';
    }
  }

  /* suppression d'une image */
  removeImageFromCategory(category: any, imgIdx: number) {
    if (imgIdx > -1) {
      category.images.splice(imgIdx, 1);
    }
  }

  /* Déplace l'image dans la catégorie précédente */
  moveImageUp(category: any, imgIdx: number) {
    const catIdx = this.categories.indexOf(category);
    if (catIdx > 0 && imgIdx > -1) {
      const image = category.images[imgIdx];
      category.images.splice(imgIdx, 1);
      this.categories[catIdx - 1].images.push(image);
    }
  }

  /* Déplace l'image dans la catégorie suivante */
  moveImageDown(category: any, imgIdx: number) {
    const catIdx = this.categories.indexOf(category);
    if (catIdx < this.categories.length - 1 && imgIdx > -1) {
      const image = category.images[imgIdx];
      category.images.splice(imgIdx, 1);
      this.categories[catIdx + 1].images.push(image);
    }
  }
}
