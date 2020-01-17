<template>
  <div class="govuk-width-container">
    <div class="govuk-main-wrapper">
      <header class="header">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-one-half">
            <!-- HEADER SECTION -->
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-two-thirds organisation__margin-bottom">
                <div class="gem-c-organisation-logo brand--ministry-of-justice">
                  <img
                    src="@/assets/jac-logo.svg"
                    alt="Judicial Appointments Commission"
                    width="197"
                    height="66"
                    style="text-align: center"
                  >
                </div>
              </div>
            </div>
            <!-- HEADER SECTION -->
          </div>
        </div>
      </header>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-full">
          <div class="govuk-phase-banner">
            <p class="govuk-phase-banner__content">
              <strong class="govuk-tag govuk-phase-banner__content__tag">
                alpha
              </strong>
              <span class="govuk-phase-banner__text">
                This is a new service – your feedback will help us improve it.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <main id="main-content">
      <div>
        <form @submit.prevent="save">
          <div class="govuk-grid-column-two-thirds">
            <h1 class="govuk-heading-l">
              Upload Independent Assessments
            </h1>

            <div class="govuk-form-group">
              <label
                class="govuk-heading-m"
                for="independent-assessment-file"
              >
                Please upload your assessment here
              </label>
              <input
                id="independent-assessment-file"
                class="govuk-file-upload"
                type="file"
                @change="fileSelected"
              >
            </div>

            <button class="govuk-button">
              Upload File
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import firebase from '@firebase/app';
import '@firebase/storage';

export default {
  name: 'App',
  components: {},
  computed: {
    applicationId() {
      const urlParams = new URLSearchParams(window.location.search);
      const myParam = urlParams.get('application-id');
      return myParam;
    },
    assessorEmail() {
      const urlParams = new URLSearchParams(window.location.search);
      const myParam = urlParams.get('assessor');
      return myParam;        
    },
  },
  methods: {
    //async save(isValid) {
    async save() {
      await this.upload();
      alert('Assessment uploaded successfully');
    },
    fileSelected(event) {
      //console.log('fileSelected called');
      if (event.target.files.length > 0) {
        //console.log(event.target.files.length);
        const file = event.target.files[0];
        //console.log(file);

        const data = {
          name: file.name,
          file: file,
          type: event.target.id,
        };
        console.log(data);
      }
    },
    upload() {
      console.log('upload function called');
      //console.log(`item.name = ${item.name}`);
      //console.log(`item.type = ${item.type}`);
      //console.log('item = ', item);

      const file = document.getElementById('independent-assessment-file').files[0];
      const fileExtension = file.name.split('.')[1];
      //console.log(fileExtension);

      const urlParams = new URLSearchParams(window.location.search);
      const assessorEmail = urlParams.get('assessor');
      const applicationId = urlParams.get('application-id');

      const fileSavePath = `application/${applicationId}/${assessorEmail}-independent-assessment.${fileExtension}`;
      console.log(`fileSavePath = ${fileSavePath}`);

      const storageRef = firebase.storage().ref();

      let uploadTask = storageRef.child(fileSavePath).put(file);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask
        .on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            (snapshot) => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              //let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              //console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                //console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                //console.log('Upload is running');
                break;
              }
            }, (error) => {

              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;

              case 'storage/canceled':
                // User canceled the upload
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
              }
            }, () => {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
              });
            });
    },
  },     
};
</script>

<style lang="scss">
// @import 'https://assets.publishing.service.gov.uk/static/govuk-template-c0b8ba8b1652aacad298d74f24752260187f538b50c40c2484f7f333cbc3cf2b.css';
@import 'https://assets.publishing.service.gov.uk/static/fonts-e9ec5a5f82e5c2a17927ce356e5a054cb28025ec1547ec5d00f5c98d2ec5e481.css';
@import 'https://assets.publishing.service.gov.uk/static/core-layout-535eb07d05bcae550061481a9cbefad8c4807bf8da32da77312cf8ef2ab616c0.css';
@import 'https://assets.publishing.service.gov.uk/collections/application-1da0069f0ad5c09cfd287444f877560d89793e621ff13c1ababf63cc4eaceb8e.css';
  // Required to include global main.scss styles
  .govuk-grid-column-one-half {
    width: 100%;
    float: left;
}
  .header {
    background-color: #fafafa;
    padding: 1.25em 0.625em 0 0.625em;
  };

  .govuk-main-wrapper {
    padding-top: 0px;
  }
</style>
