import React, { useState, useEffect } from 'react'
import './Dropbox.css'
import { assets } from '../../assets/assets'
import sttinstance from '../../api/sttapi'
import transinstance from '../../api/transapi'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Language } from '../../assets/language'
import { setTextContent, setTranslation, setPlainText } from '../../store/reducers/videoContent'
import { useDispatch, useSelector } from 'react-redux'

const Dropbox = () => {
  const [data, setData] = useState({
    target_language: 'en',
    text: '',
    translated_text: '',
  })
  const dispatch = useDispatch();
  const videoText = useSelector(state => state.videoContent.plainText);
  const videoContent = useSelector(state => state.videoContent.textContent);
  const videoTranslation = useSelector(state => state.videoContent.translation);
  const updateContent = (value) => {
    dispatch(setTextContent(value));
  }
  const updateTranslation = (value) => {
    dispatch(setTranslation(value));
  }
  const updatePlainText = (value) => {
    dispatch(setPlainText(value));
  }
  const [file, setFile] = useState(false);
  const [textValue, setTextValue] = useState('');
  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    // formData.append('target_language', data.target_language)
    formData.append('file', file);
    try {
      const response = await sttinstance.post('', formData)
      console.log(response)
      if (response.statusText == "OK") {
        const combinedText = Object.keys(response.data)
          .map(index => response.data[index]["text"])
          .join('');
        updateContent(response.data);
        setTextValue(combinedText);
        toast.success("Extract text successfully");
      } else {
        toast.error("File upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("File upload failed");
    }
  }

  const translateText = async () => {
    try {
      const response = await transinstance.post('', { text: plainText, target_lang: data.target_language });
      console.log(response)
      if (response.statusText == "OK") {
        updateTranslation(response.data.translated_text);
        toast.success("Translation success");
      } else {
        toast.error("Translation failed");
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed");
    }
  }

  useEffect(() => {
    if (textValue) {
      // translateText();
      updatePlainText(textValue);
    }
  }, [textValue]);

  return (
    <div className='container'>
      <h1>Dropbox</h1>
      <hr />
      <div className='dropbox'>
        <div className='upload_area'>
          <form id="uploadForm" onSubmit={onSubmitHandler}>
            <div className='target_language'>
              <p>Target Language</p>
              <select onChange={onChangeHandler} name="target_language" value={data.target_language}>
                {
                  Object.keys(Language).map((index) => {
                    return <option key={Language[index]} value={Language[index]}>{index}</option>
                  })
                }
                {/* <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="zh">Chinese</option> */}
              </select>
            </div>
            <div className='add_file_upload'>
              <label htmlFor='file'>
                <div className='add_file_upload_container'>
                  <p>Upload Video</p>
                  {file ? <div className='file_name_container'><p className='file_name'>{file.name}</p></div> : <img src={assets.upload_area} alt="" />}
                </div>
              </label>
              <input onChange={(e) => setFile(e.target.files[0])} type="file" name="file" accept="audio/*" id='file' hidden required />
            </div>
            <button type="submit">Upload</button>
          </form>
        </div>
        <div className='result_area'>
          {videoText === "" ? <h2>Upload a file to see the result</h2> :
            <div className='text'>
              <h2>Text extracted: </h2>
              <p>{videoText}</p>
              {
                Object.keys(videoTranslation).length === 0 ? <h2>Translation not available</h2> :
                  <div className='translation'>
                    <h2>Translation: </h2>
                    <p>{videoTranslation}</p>
                  </div>
              }
            </div>}
        </div>
      </div>
    </div>
  )
}

export default Dropbox
