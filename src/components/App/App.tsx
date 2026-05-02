import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import { getPhotos } from "../../services/photos";
import { useState } from "react";
import type { Photo } from "../../types/photo";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";
import Modal from "../Modal/Modal";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectPhoto, setSelectPhoto] = useState<Photo | null>(null);

  const handleSearch = async (value: string) => {
    try {
      setIsError(false);
      setIsLoading(true);
      setPhotos([]);
      const res = await getPhotos(value);
      if (res) {
        setPhotos(res);
      } else {
        toast.error("За Вашим запитом не знайдено результатів");
      }
    } catch {
      toast.error("Спробуйте ще раз, будь ласка, тепер літерами");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSearch} />
          {isLoading && <Loader />}
          {isError && <Text>Упс... Спробуйте ще раз</Text>}
          <PhotosGallery
            photos={photos}
            onSelect={(photo: Photo) => {
              setSelectPhoto(photo);
            }}
          />
          {selectPhoto && (
            <Modal onClose={() => setSelectPhoto(null)}>
              <div
                style={{
                  backgroundColor: selectPhoto.avg_color,
                  borderColor: selectPhoto.avg_color,
                }}
              >
                <img src={selectPhoto.src.original} alt={selectPhoto.alt} />
              </div>
            </Modal>
          )}
        </Container>
      </Section>
    </>
  );
}
