<template>
  <div class="govuk-grid-row">
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
</template>

<script>
  import firebase from '@firebase/app';
  import '@firebase/storage';

  export default {
    name: 'Upload',
    computed: {
      applicationId() {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('reference-num');
        return myParam;
      },
      assessorEmail() {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('assessor');
        return myParam;        
      }
    },
    methods: {
      //async save(isValid) {
      async save() {
        await this.upload(this.files['independent-assessment-file']);
        alert('Thanks for uploading your assessment');
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
          //console.log(data);

          //console.log(`Before this.files[data.type] = ${this.files[data.type]}`);
          this.files[data.type] = data;
          //console.log(`After this.files[data.type] = ${this.files[data.type].name}`);
        }
      },
      upload(item) {
        //console.log('upload function called');
        //console.log(`item.name = ${item.name}`);
        //console.log(`item.type = ${item.type}`);
        //console.log('item = ', item);

        const file = item.file;
        const fileExtension = file.name.split('.')[1];
        //console.log(fileExtension);

        const urlParams = new URLSearchParams(window.location.search);
        const assessorEmail = urlParams.get('assessor')
        const applicationId = urlParams.get('applicationId')

        const fileNameMap = new Map([
          ['independent-assessment-file', `${assessorEmail}-independent-assessment`],
        ]);

        const fileName = fileNameMap.get(item.type);
        const fileSavePath = `application-${applicationId}/${fileName}.${fileExtension}`;
        //console.log(`fileSavePath = ${fileSavePath}`);

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
                  //console.log('File available at', downloadURL);
                  alert(`downloadURL = ${downloadURL}`);

/*
                  const file = item.file;
                  const fileExtension = file.name.split('.')[1];

                  if (downloadURL.includes('job-description')) {

                    // set job description database values
                    this.exercise.uploadedJobDescriptionTemplate = `job-description.${fileExtension}`;
                  } else if (downloadURL.includes('terms-and-conditions')) {

                    // set terms and conditions database values
                    this.exercise.uploadedTermsAndConditionsTemplate = `terms-and-conditions.${fileExtension}`;
                  } else if (downloadURL.includes('independent-assessor')) {

                    // set independent assessor database values
                    this.exercise.uploadedIndependentAssessorTemplate = `independent-assessor.${fileExtension}`;
                  } else if (downloadURL.includes('candidate-assessment-form')) {

                    // set candidate assessment form database values
                    this.exercise.uploadedCandidateAssessmentFormTemplate = `candidate-assessment-form.${fileExtension}`;
                  }

                  // don't forget to save
                  this.$store.dispatch('exerciseDocument/save', this.exercise);
                  //console.log('uploadedJobDescriptionTemplate = ', this.exercise.uploadedJobDescriptionTemplate);
*/
                });
              });
      },
    }    
  }
</script>