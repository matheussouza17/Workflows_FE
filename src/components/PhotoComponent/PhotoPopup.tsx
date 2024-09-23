// components/PhotoPopup.tsx
import { useState } from 'react';
import styles from './PhotoPopup.module.scss';
import { Button } from '../../components/ui/Button'

const photoList = [
  'avatar_adulto_cabelo_grisalho.png',
  'avatar_adulto_com_toca_amarela.png',
  'avatar_adulto_ruivo_com_oculos.png',
  'avatar_garota_jovem_cabelo_lilas.png',
  'avatar_garoto_jovem_com_oculos_metaverso.png',
  'avatar_garoto_jovem_sem_oculos.png',
  'avatar_homem_adulto_idade_avancada.png',
  'avatar_idoso.png',
  'avatar_jovem_masculino_com_dreadlock.png',
  'avatar_mulher_adulta_loira.png',
  'avatar_mulher_adulta_negra.png'
];

interface PhotoPopupProps {
  onClose: () => void;
  onSelectPhoto: (photo: string) => void;
}

export default function PhotoPopup({ onClose, onSelectPhoto }: PhotoPopupProps) {
  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
        <h2>Selecione uma Foto</h2>
        <div className={styles.photoGrid}>
          {photoList.map((photo, index) => (
            <div key={index} className={styles.photoItem} onClick={() => onSelectPhoto(photo)}>
              <img src={`/avatar/${photo}`} alt={`Foto ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <Button
                type='reset'
                onClick={onClose}
              >
                Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
