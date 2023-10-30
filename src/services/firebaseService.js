import firebase from 'firebase/app';

export const postComic = async (
  title,
  author,
  trialReadUrl,
  recommendation,
  popularity,
  genre,
  quote,
  comicImage,
  comicEncoded,
  frameImage,
  frameEncoded,
) => {
  let addComic = null;
  if (!comicImage || !frameImage) {
    // ファイルが選択されていないなら何もしない
    return null;
  }

  const comicTitle = title;
  const comicAuthor = author;
  const comicTrialReadUrl = trialReadUrl;
  const comicRecommendation = recommendation;
  const comicPopularity = popularity;
  const comicGenre = genre;
  const comicQuote = quote;
  const comicComicImage = comicImage;
  const comicFrameImage = frameImage;
  const filenameComic = comicImage.name; // コミック画像ファイル名
  const filenameFrame = frameImage.name; // コマ画像ファイル名
  const comicImageLocation = `comic-images/${filenameComic}`; // コミック画像のアップロード先
  const frameImageLocation = `frame-images/${filenameFrame}`; // コミック画像のアップロード先

  // Firestoreに送る書籍データ
  const comicData = {
    comicTitle,
    comicAuthor,
    comicTrialReadUrl,
    comicRecommendation,
    comicPopularity,
    comicGenre,
    comicQuote,
    comicImageLocation,
    frameImageLocation,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  await firebase
    .storage()
    .ref(comicImageLocation)
    .put(comicComicImage)// Storageへファイルアップロードを実行
    .then(() => firebase.storage().ref(frameImageLocation).put(comicFrameImage))// 2つ目のファイルアップロードを実行
    .then(() => {
      // Storageへのアップロードに成功したら、Firestoreに書籍データを保存する
      const docRef = firebase
        .firestore()
        .collection('comics')
        .doc();

      docRef.set(comicData);
      addComic = {
        id: docRef.id,
        title: comicTitle,
        author: comicAuthor,
        trialReadUrl: comicTrialReadUrl,
        recommendation: comicRecommendation,
        popularity: comicPopularity,
        genre: comicGenre,
        quote: comicQuote,
        comicImage: comicEncoded,
        frameImage: frameEncoded,
      };
    });

  return addComic;
};

export const getComics = async () => {
  // 現在のcomicsの値を取得
  const comicsSnapshot = await firebase
    .firestore()
    .collection('comics')
    .orderBy('createdAt')
    .get();
  const { docs } = comicsSnapshot;
  const storage = firebase.storage();

  const comicPromises = docs.map(async (doc) => {
    const {
      comicTitle,
      comicAuthor,
      comicTrialReadUrl,
      comicRecommendation,
      comicPopularity,
      comicGenre,
      comicQuote,
      comicImageLocation,
      frameImageLocation,
    } = doc.data();

    // Storageから、個々の書籍データに対応する表紙画像のURLを取得。次行のコメントは、ループ処理でawaitを使うため
    // eslint-disable-next-line no-await-in-loop
    const comicImagePromise = storage.ref(comicImageLocation).getDownloadURL();
    const frameImagePromise = storage.ref(frameImageLocation).getDownloadURL();

    const [comicImage, frameImage] = await Promise.all([comicImagePromise, frameImagePromise]);

    return {
      id: doc.id,
      title: comicTitle,
      author: comicAuthor,
      trialReadUrl: comicTrialReadUrl,
      recommendation: comicRecommendation,
      popularity: comicPopularity,
      genre: comicGenre,
      quote: comicQuote,
      comicImage,
      frameImage,
    };
  });
  const comics = await Promise.all(comicPromises);
  return comics;
};

export const deleteComic = (id) => {
  const docRef = firebase.firestore().collection('comics').doc(id);
  docRef.get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const comicImageLoc = data.comicImageLocation;
        const storageComicRef = firebase.storage().ref(comicImageLoc);
        storageComicRef.delete();
        const frameImageLoc = data.frameImageLocation;
        const storageFrameRef = firebase.storage().ref(frameImageLoc);
        storageFrameRef.delete();
        docRef.delete();
      } else {
        console.log('指定されたドキュメントが存在しません');
      }
    })
    .catch((error) => {
      console.error('エラーが発生しました。', error);
    });
};
