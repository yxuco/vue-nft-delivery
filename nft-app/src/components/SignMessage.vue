<template>
  <b-container fluid class="p-3">
    <b-form @submit="signToken">
      <b-input-group prepend="Token ID">
        <b-form-input v-model="token.id" placeholder="Enter NFT Token ID"></b-form-input>
        <b-input-group-append>
          <b-form-select v-model="token.contract" :options="contracts" class="bg-secondary text-white">
            <template #first>
              <b-form-select-option :value="null" disabled>-- Select a token type --</b-form-select-option>
            </template>
          </b-form-select>
          <b-button variant="info" type="submit">Sign</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form>
    <b-card class="mt-3 text-start" header="Token Signature" v-if="message">
      <pre class="m-0">{{ message }}</pre>
    </b-card>
    <b-card class="mt-3 text-start" header="Signature Error" v-if="error">
      <pre class="m-0">{{ error }}</pre>
    </b-card>
    <b-card class="mt-3 text-start" header="Signature Verification" v-if="verification">
      <pre class="m-0">{{ verification }}</pre>
    </b-card>
  </b-container>
</template>

<script>
import { signMessage, verifyToken, getContracts } from '../services/SigService'
export default {
  name: 'SignMessage',
  data() {
    return {
      token: {
        id: '',
        contract: null
      },
      contracts: [],
      message: null,
      error: null,
      verification: null
    }
  },
  watch: {
    message(newValue) {
      if (newValue.signature) {
        verifyToken(newValue).then(result => {
          this.verification = result;
        })
      }
    }
  },
  methods: {
    signToken() {
      signMessage(this.token.id, this.token.contract).then(result => {
        if (result.error) {
          this.error = {error: result.error}
          this.message = null
        } else {
          this.error = null
          this.message = {
            tokenId: this.token.id,
            contract: this.token.contract,
            signature: result.signature,
            signer: result.address
          }
        }
      })
    }
  },
  mounted() {
    console.log("SignMessage mount - get contract list !!!!")
    getContracts().then(data => {
      this.contracts = data.map(x => ({value: x.address, text: x.name}));
      console.log(this.contracts);
    })
  }
}
</script>