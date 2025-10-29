import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import { useSelector } from "react-redux";

import "react-circular-progressbar/dist/styles.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import 'quill/dist/quill.snow.css';
export default function UpdatePost() {
  const [file, setFile] = useState(null);

  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [publishSuccessfully, setPublishSuccessfully] = useState(false);
  const { postId } = useParams();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        } else {
          setPublishError(false);
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    setPublishSuccessfully(false);
    try {
      setPublishError(null);
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      console.log(res.ok);
      if (!res.ok) {
        setPublishError("Error in publishing");
        return;
      }
      console.log(data);
      if (data) {
        setPublishError(null);
        setPublishSuccessfully(true);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("please select an image");
      return;
    }
    console.log(file);

    setImageUploadError(null);
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          setImageUploadError("image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({
              ...formData,
              image: downloadURL,
            });
          });
        }
      );
    } catch (error) {
      setImageUploadError("image upload failed");
      setImageUploadProgress(null);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a new Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">ReactJS</option>
            <option value="nextjs">NextJS</option>
            <option value="angularjs">AngularJS</option>
            <option value="nodejs">NodeJS</option>
            <option value="expressjs">ExpressJS</option>
            <option value="mongodb">MongoDB</option>
            <option value="mongoose">Mongoose</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />

          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0} %`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <div>
            <img src={formData.image} />
          </div>
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
          required
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
        {publishSuccessfully && (
          <Alert color="success">Post Published Successfully</Alert>
        )}
      </form>
    </div>
  );
}
