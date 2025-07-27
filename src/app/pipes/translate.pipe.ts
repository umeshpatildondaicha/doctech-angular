import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  
  // Simple translation dictionary - in a real app, this would come from a service
  private translations: { [key: string]: { [key: string]: string } } = {
    'en': {
      'exercise': 'Exercise',
      'exercise_set': 'Exercise Set',
      'exercises': 'Exercises',
      'exercise_sets': 'Exercise Sets',
      'set_id': 'Set ID',
      'exercise_id': 'Exercise ID',
      'set_number': 'Set Number',
      'reps': 'Reps',
      'hold_time': 'Hold Time',
      'rest_time': 'Rest Time',
      'name': 'Name',
      'description': 'Description',
      'created_by': 'Created By',
      'exercise_type': 'Exercise Type',
      'strength': 'Strength',
      'core': 'Core',
      'flexibility': 'Flexibility',
      'cardio': 'Cardio',
      'add': 'Add',
      'edit': 'Edit',
      'delete': 'Delete',
      'save': 'Save',
      'cancel': 'Cancel',
      'search': 'Search',
      'filter': 'Filter',
      'clear': 'Clear',
      'loading': 'Loading...',
      'no_data': 'No data available',
      'error': 'Error',
      'success': 'Success',
      'warning': 'Warning',
      'info': 'Information'
    },
    'es': {
      'exercise': 'Ejercicio',
      'exercise_set': 'Conjunto de Ejercicios',
      'exercises': 'Ejercicios',
      'exercise_sets': 'Conjuntos de Ejercicios',
      'set_id': 'ID del Conjunto',
      'exercise_id': 'ID del Ejercicio',
      'set_number': 'Número de Conjunto',
      'reps': 'Repeticiones',
      'hold_time': 'Tiempo de Mantenimiento',
      'rest_time': 'Tiempo de Descanso',
      'name': 'Nombre',
      'description': 'Descripción',
      'created_by': 'Creado Por',
      'exercise_type': 'Tipo de Ejercicio',
      'strength': 'Fuerza',
      'core': 'Núcleo',
      'flexibility': 'Flexibilidad',
      'cardio': 'Cardio',
      'add': 'Agregar',
      'edit': 'Editar',
      'delete': 'Eliminar',
      'save': 'Guardar',
      'cancel': 'Cancelar',
      'search': 'Buscar',
      'filter': 'Filtrar',
      'clear': 'Limpiar',
      'loading': 'Cargando...',
      'no_data': 'No hay datos disponibles',
      'error': 'Error',
      'success': 'Éxito',
      'warning': 'Advertencia',
      'info': 'Información'
    },
    'fr': {
      'exercise': 'Exercice',
      'exercise_set': 'Série d\'Exercices',
      'exercises': 'Exercices',
      'exercise_sets': 'Séries d\'Exercices',
      'set_id': 'ID de Série',
      'exercise_id': 'ID d\'Exercice',
      'set_number': 'Numéro de Série',
      'reps': 'Répétitions',
      'hold_time': 'Temps de Maintien',
      'rest_time': 'Temps de Repos',
      'name': 'Nom',
      'description': 'Description',
      'created_by': 'Créé Par',
      'exercise_type': 'Type d\'Exercice',
      'strength': 'Force',
      'core': 'Noyau',
      'flexibility': 'Flexibilité',
      'cardio': 'Cardio',
      'add': 'Ajouter',
      'edit': 'Modifier',
      'delete': 'Supprimer',
      'save': 'Enregistrer',
      'cancel': 'Annuler',
      'search': 'Rechercher',
      'filter': 'Filtrer',
      'clear': 'Effacer',
      'loading': 'Chargement...',
      'no_data': 'Aucune donnée disponible',
      'error': 'Erreur',
      'success': 'Succès',
      'warning': 'Avertissement',
      'info': 'Information'
    }
  };

  transform(value: string, language: string = 'en', params?: any): string {
    if (!value) {
      return '';
    }

    // Get the translation for the current language
    const langTranslations = this.translations[language] || this.translations['en'];
    let translation = langTranslations[value] || value;

    // Replace parameters if provided
    if (params) {
      Object.keys(params).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        translation = translation.replace(regex, params[key]);
      });
    }

    return translation;
  }

  // Method to get available languages
  getAvailableLanguages(): string[] {
    return Object.keys(this.translations);
  }

  // Method to check if a translation exists
  hasTranslation(key: string, language: string = 'en'): boolean {
    const langTranslations = this.translations[language] || this.translations['en'];
    return !!langTranslations[key];
  }
} 