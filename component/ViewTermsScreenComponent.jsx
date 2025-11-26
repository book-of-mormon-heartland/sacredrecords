import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { useI18n } from '.././context/I18nContext'; 
var Environment = require('.././context/environment.ts');



const ViewTermsScreenComponent = ( {navigation} ) => {

  const { language, setLanguage, translate } = useI18n();
  // Use state to manage the input values
  

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.settingTitle}>{translate('terms_of_use_title')}</Text>
        <Text style={styles.text}>{translate('terms_of_use_text_1')}</Text>
        <Text style={styles.text}>{translate('terms_of_use_text_2')}</Text>
        <Text style={styles.text}>{translate('terms_of_use_text_3')}</Text>
        <Text style={styles.text}>{translate('terms_of_use_text_4')}</Text>
        <Text style={styles.text}>{translate('terms_of_use_text_5')}</Text>
        <Text style={styles.text}>{translate('terms_of_use_text_6')}</Text>
        <Text style={styles.text}>{translate('terms_of_use_text_7')}</Text>
        <Text style={styles.text}>{translate('terms_of_use_text_8')}</Text>
        <Text style={styles.text}>{translate('terms_of_use_text_9')}</Text>
        <Text style={styles.text}>{translate('terms_of_use_text_10')}</Text>
        <Text style={styles.text}>{translate('terms_of_use_text_11')}</Text>
      </View>
    </ScrollView>
  );
};


/*

  <Text style={styles.text}>{translate('terms_of_use_text_7')}</Text>
  <Text style={styles.text}>{translate('terms_of_use_text_8')}</Text>
  <Text style={styles.text}>{translate('terms_of_use_text_9')}</Text>
  <Text style={styles.text}>{translate('terms_of_use_text_10')}</Text>
  <Text style={styles.text}>{translate('terms_of_use_text_11')}</Text>
  <Text style={styles.text}>{translate('terms_of_use_text_12')}</Text>
  <Text style={styles.text}>{translate('terms_of_use_text_13')}</Text>
  <Text style={styles.text}>{translate('terms_of_use_text_14')}</Text>
  <Text style={styles.text}>{translate('terms_of_use_text_15')}</Text>

  "terms_of_use_text_9": "\ne. NO WARRANTY: YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT USE OF THE LICENSED APPLICATION IS AT YOUR SOLE RISK. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE LICENSED APPLICATION AND ANY SERVICES PERFORMED OR PROVIDED BY THE LICENSED APPLICATION ARE PROVIDED "AS IS" AND “AS AVAILABLE,” WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND, AND LICENSOR HEREBY DISCLAIMS ALL WARRANTIES AND CONDITIONS WITH RESPECT TO THE LICENSED APPLICATION AND ANY SERVICES, EITHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES AND/OR CONDITIONS OF MERCHANTABILITY, OF SATISFACTORY QUALITY, OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY, OF QUIET ENJOYMENT, AND OF NONINFRINGEMENT OF THIRD-PARTY RIGHTS. NO ORAL OR WRITTEN INFORMATION OR ADVICE GIVEN BY LICENSOR OR ITS AUTHORIZED REPRESENTATIVE SHALL CREATE A WARRANTY. SHOULD THE LICENSED APPLICATION OR SERVICES PROVE DEFECTIVE, YOU ASSUME THE ENTIRE COST OF ALL NECESSARY SERVICING, REPAIR, OR CORRECTION. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES OR LIMITATIONS ON APPLICABLE STATUTORY RIGHTS OF A CONSUMER, SO THE ABOVE EXCLUSION AND LIMITATIONS MAY NOT APPLY TO YOU.",
  "terms_of_use_text_10": "\nf. Limitation of Liability. TO THE EXTENT NOT PROHIBITED BY LAW, IN NO EVENT SHALL LICENSOR BE LIABLE FOR PERSONAL INJURY OR ANY INCIDENTAL, SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE LICENSED APPLICATION, HOWEVER CAUSED, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, OR OTHERWISE) AND EVEN IF LICENSOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OF LIABILITY FOR PERSONAL INJURY, OR OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS LIMITATION MAY NOT APPLY TO YOU. In no event shall Licensor’s total liability to you for all damages (other than as may be required by applicable law in cases involving personal injury) exceed the amount of fifty dollars ($50.00). The foregoing limitations will apply even if the above stated remedy fails of its essential purpose.",
  "terms_of_use_text_11": "\ng. You may not use or otherwise export or re-export the Licensed Application except as authorized by United States law and the laws of the jurisdiction in which the Licensed Application was obtained. In particular, but without limitation, the Licensed Application may not be exported or re-exported (a) into any U.S.-embargoed countries or (b) to anyone on the U.S. Treasury Department's Specially Designated Nationals List or the U.S. Department of Commerce Denied Persons List or Entity List. By using the Licensed Application, you represent and warrant that you are not located in any such country or on any such list. You also agree that you will not use these products for any purposes prohibited by United States law, including, without limitation, the development, design, manufacture, or production of nuclear, missile, or chemical or biological weapons.",
  "terms_of_use_text_12": "\nh. The Licensed Application and related documentation are \"Commercial Items\", as that term is defined at 48 C.F.R. §2.101, consisting of "Commercial Computer Software" and "Commercial Computer Software Documentation", as such terms are used in 48 C.F.R. §12.212 or 48 C.F.R. §227.7202, as applicable. Consistent with 48 C.F.R. §12.212 or 48 C.F.R. §227.7202-1 through 227.7202-4, as applicable, the Commercial Computer Software and Commercial Computer Software Documentation are being licensed to U.S. Government end users (a) only as Commercial Items and (b) with only those rights as are granted to all other end users pursuant to the terms and conditions herein. Unpublished-rights reserved under the copyright laws of the United States.",
  "terms_of_use_text_13": "\ni. Except to the extent expressly provided in the following paragraph, this Agreement and the relationship between you and Apple shall be governed by the laws of the State of California, excluding its conflicts of law provisions. You and Apple agree to submit to the personal and exclusive jurisdiction of the courts located within the county of Santa Clara, California, to resolve any dispute or claim arising from this Agreement. If (a) you are not a U.S. citizen; (b) you do not reside in the U.S.; (c) you are not accessing the Service from the U.S.; and (d) you are a citizen of one of the countries identified below, you hereby agree that any dispute or claim arising from this Agreement shall be governed by the applicable law set forth below, without regard to any conflict of law provisions, and you hereby irrevocably submit to the non-exclusive jurisdiction of the courts located in the state, province or country identified below whose law governs:",
  "terms_of_use_text_14": "\nIf you are a citizen of any European Union country or Switzerland, Norway or Iceland, the governing law and forum shall be the laws and courts of your usual place of residence.",
  "terms_of_use_text_15": "\nSpecifically excluded from application to this Agreement is that law known as the United Nations Convention on the International Sale of Goods."
*/


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },

  input: {
    borderWidth: 1,          // adds the border
    borderColor: '#ccc',     // border color
    borderRadius: 8,         // rounded corners
    padding: 12,             // inner spacing
    fontSize: 18,            // larger text
    marginBottom: 16,        // space between inputs
    backgroundColor: '#fff', // optional, looks nice on gray backgrounds
  },

  text: {
    fontSize: 14,
  },
  errorText: {
    color: "#ff0000",
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  settingTitle: {
    paddingTop: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  settingDev: {
    color: "#ff0000",
    paddingTop: 10,
    fontSize: 14,
    textAlign: 'left',
  },
  label: {
    fontSize: 16,
    marginBottom: 0,
    fontWeight: 'bold',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff', // White background for the button
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light gray border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
  },
  submitButtonText: {
    color: '#ffffff', // Google's gray text color
    fontSize: 14,
    fontWeight: 'bold',
  },


});

export default ViewTermsScreenComponent;