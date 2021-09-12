import React, { Component } from "react";

import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  setDoc,
  doc,
  writeBatch,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import db from "../firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import moment from "moment";

class Home extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      title: "",
      subtitle: "",
      source: "",
      descp: "",
      file: "",
      uploadShow: false,
      progress: 0,
      imageUrl: null,
      totalCount: 0,
      loader: false,
    };
  }

  funcName = async () => {
    const querySnapshot = await getDocs(collection(db, "news"));

    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  };

  componentDidMount() {
    // this.funcName();
  }

  changeData(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    //     const db = firebase.firestore();
    //   db.settings({
    //     timestampsInSnapshots: true
    //   });
    //   const userRef = db.collection(“users”).add({
    //     fullname: this.state.fullname,
    //     email: this.state.email
    //   });
    // const docRef = await addDoc(collection(db, "news"), {
    //   name: this.state.name,
    //   description: this.state.descp,
    // });

    // console.log(docRef);

    // const docData = {
    //   stringExample: "Hello world!",
    //   booleanExample: true,
    //   numberExample: 3.14159265,
    //   dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
    //   arrayExample: [5, true, "hello"],
    //   nullExample: null,
    //   objectExample: {
    //     a: 5,
    //     b: {
    //       nested: "foo",
    //     },
    //   },
    // };
    // await setDoc(doc(db, "news", "one"), docData);
    this.setState({
      loader: true,
    });

    const docData = {
      author: this.state.name,
      content: this.state.descp,
      imageUrl: this.state.imageUrl,
      time: Timestamp.fromDate(new Date()),
      source: this.state.source,
      subtitle: this.state.subtitle,
      title: this.state.title,
    };

    // const dataRef = doc(db, "news", "08/09/2021");

    // await setDoc(doc(db, "news", "articles"), docData, { merge: true });
    // Get a new write batch
    // const batch = writeBatch(db);
    // const dataRef = doc(db, "news", "articles");
    // batch.update(dataRef, docData);

    // await batch.commit();

    const dataRef = doc(db, "news", "articles");

    // Atomically add a new region to the "regions" array field.
    await updateDoc(dataRef, {
      data: arrayUnion(docData),
    });

    const docSnap = await getDoc(dataRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const data = docSnap.data();
      this.setState({
        totalCount: data.data.length,
      });

      console.log(this.state.totalCount);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    // Get a new write batch
    const batch = writeBatch(db);
    batch.update(dataRef, { total: this.state.totalCount });

    await batch.commit();

    this.setState({
      name: "",
      descp: "",
      source: "",
      title: "",
      subtitle: "",
      file: "",
      progress: 0,
      imageUrl: null,
      uploadShow: false,
      loader: false,
    });
  };

  fileSelect(e) {
    // console.log(e.target.files[0]);
    e.preventDefault();
    this.setState({
      file: e.target.files[0],
      uploadShow: true,
    });
  }

  uploadFile() {
    // e.preventDefault();

    const storage = getStorage();

    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = ref(storage, "images/" + this.state.file.name);
    const uploadTask = uploadBytesResumable(
      storageRef,
      this.state.file,
      metadata
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        this.setState({
          progress: progress,
        });

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          case "success":
            console.log("Upload success");
            this.setState({
              uploadShow: false,
            });
            break;
        }
      },
      (error) => {
        console.log(error);
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log(downloadURL);
          this.setState({
            imageUrl: downloadURL,
          });
        });
      }
    );
  }

  render() {
    return (
      <div className="container">
        <div className="home_screen content">
          <h1 className="mb-3">Nurses Pedia Portal</h1>
          <form onSubmit={(e) => this.onSubmit(e)}>
            <div>
              <div className="form-group col-md-6 mb-4">
                <label>Name:</label>
                <input
                  type="text"
                  value={this.state.name}
                  name="name"
                  onChange={(e) => this.changeData(e)}
                  className="form-control np_input"
                />
              </div>

              <div className="form-group col-md-6 mb-4">
                <label>Title:</label>
                <input
                  type="text"
                  value={this.state.title}
                  name="title"
                  onChange={(e) => this.changeData(e)}
                  className="form-control np_input"
                />
              </div>

              <div className="form-group col-md-6 mb-4">
                <label>Subtitle:</label>
                <input
                  type="text"
                  value={this.state.subtitle}
                  name="subtitle"
                  onChange={(e) => this.changeData(e)}
                  className="form-control np_input"
                />
              </div>

              <div className="form-group col-md-6 mb-4">
                <label>Source:</label>
                <input
                  type="text"
                  value={this.state.source}
                  name="source"
                  onChange={(e) => this.changeData(e)}
                  className="form-control np_input"
                />
              </div>

              <div className="col-md-6 mb-4">
                <label>Description:</label>
                <textarea
                  name="descp"
                  value={this.state.descp}
                  onChange={(e) => this.changeData(e)}
                  className="form-control"
                />
              </div>

              {/* <form> */}
              <div className="col-md-6">
                <label>Image Upload:</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => this.fileSelect(e)}
                />

                {this.state.uploadShow && (
                  <>
                    <button
                      type="button"
                      className="btn upload_img_btn mt-3"
                      disabled={!this.state.uploadShow}
                      onClick={() => this.uploadFile()}
                    >
                      Upload
                    </button>

                    <div class="progress mt-2">
                      <div
                        class="progress-bar"
                        role="progressbar"
                        aria-valuenow={this.state.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: `${this.state.progress}%` }}
                      ></div>
                    </div>
                  </>
                )}
              </div>
              {/* </form> */}
            </div>

            <button
              type="submit"
              className="btn primary-btn mt-3"
              disabled={
                this.state.name === "" ||
                this.state.descp === "" ||
                this.state.source === "" ||
                this.state.title === "" ||
                this.state.subtitle === "" ||
                this.state.file === ""
                  ? true
                  : false
              }
            >
              Submit
            </button>
          </form>
          {this.state.loader && (
            <div className="loader">
              <div
                id="loading-indicator"
                // style="width: 60px; height: 60px;"
                style={{
                  width: 60,
                  height: 60,
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                }}
                role="progressbar"
                class="MuiCircularProgress-root MuiCircularProgress-colorPrimary MuiCircularProgress-indeterminate"
              >
                <svg viewBox="22 22 44 44" class="MuiCircularProgress-svg">
                  <circle
                    cx="44"
                    cy="44"
                    r="20.2"
                    fill="none"
                    stroke-width="3.6"
                    class="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate"
                  ></circle>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
