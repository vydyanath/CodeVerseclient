import axios from 'axios';
import qs from 'qs';
import { LANGUAGE_VERSIONS } from './languageversions';

const executeCode = async (value,language) => {
  let codeValue = String(value).trim(); 
  console.log(codeValue);
  console.log(language);
  console.log(LANGUAGE_VERSIONS[language]);
  var data = qs.stringify({
    'code': codeValue,
    'language': LANGUAGE_VERSIONS[language],
    'input': ''
});

  const config = {
    method: 'post',
    url: 'https://api.codex.jaagrav.in',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data.output;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};

export default executeCode;
