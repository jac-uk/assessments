<template>
  <div
    class="govuk-form-group"
    :class="{'govuk-form-group--error': hasError}"
  >
    <label
      :for="id"
      class="govuk-heading-m govuk-!-margin-bottom-2"
    >
      {{ label }}
    </label>
    <span
      v-if="hint"
      class="govuk-hint"
    >
      {{ hint }}
    </span>
    <FormFieldError
      :id="id"
      :error-message="errorMessage"
    />
    <input
      :id="id"
      v-model="text"
      class="govuk-input"
      :class="[inputClass, {'govuk-input--error': hasError}]"
      :type="fieldType"
      @change="validate"
    >
  </div>
</template>

<script>
import FormField from '@/components/Form/FormField.vue';
import FormFieldError from '@/components/Form/FormFieldError.vue';

export default {
  components: {
    FormFieldError,
  },
  extends: FormField,
  props: {
    inputClass: {
      default: '',
      type: String,
    },
    value: {
      default: '',
      type: String,
    },
    type: {
      default: 'text',
      type: String,
    },
  },
  computed: {
    text: {
      get() {
        return this.value;
      },
      set(val) {
        this.emitter.emit('input', val);
      },
    },
    fieldType() {
      switch (this.type) {
      case 'text':
      case 'email':
        return 'text'; // we are using custom email validation, so don't use html5 input types
      default:
        return this.type;
      }
    },
  },
};
</script>
