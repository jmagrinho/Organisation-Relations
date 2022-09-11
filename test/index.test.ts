import { request } from './utils';

//#region Tests Endpoint 1

// describe('Endpoint 1 - GET ', () => {
//   test('Should warn page number is invalid (if it is < 0 or or not number)', async () => {
//     const result = await request.get('/ANY_NAME/-1');
//     const resultJSON = JSON.parse(result.text)
//     expect(resultJSON.status_code).toBe(400);
//     expect(resultJSON.status_message).toBe("Page number is invalid.");
//   }),

//   test('Should warn page number is invalid V2 (if it is < 0 or not number)', async () => {
//     const result = await request.get('/ANY_NAME/a');
//     const resultJSON = JSON.parse(result.text)
//     expect(resultJSON.status_code).toBe(400);
//     expect(resultJSON.status_message).toBe("Page number is invalid.");
//   }),

//   test('Result status should be OK even if the organisation name does not exist', async () => {
//     const result = await request.get('/ANY_NON_EXISTING_NAME/0');
//     const resultJSON = JSON.parse(result.text)
//     expect(resultJSON.status_code).toBe(200);
//     expect(resultJSON.status_message).toBe("OK");
//   }),

//   test('An existing organisation name should bring results on first page', async () => {
//     const result = await request.get('/Black%20Banana/0');
//     const resultJSON = JSON.parse(result.text)
//     expect(resultJSON.status_code).toBe(200);
//     expect(resultJSON.status_message).toBe("OK");
//     expect(resultJSON.results_count).toBeGreaterThan(0);
//   }),

//   test('README Example - Black Banana organisation results:', async () => {
//     const result = await request.get('/Black%20Banana/0');
//     const resultJSON = JSON.parse(result.text)
//     expect(resultJSON.status_code).toBe(200);
//     expect(resultJSON.status_message).toBe("OK");
//     expect(JSON.stringify(resultJSON.results)).toBe(`[{"org_name":"Banana tree","relationship_type":"parent"},{"org_name":"Big banana tree","relationship_type":"parent"},{"org_name":"Brown Banana","relationship_type":"sister"},{"org_name":"Green Banana","relationship_type":"sister"},{"org_name":"Phoneutria Spider","relationship_type":"daughter"},{"org_name":"Yellow Banana","relationship_type":"sister"}]`)
    
//   })


// });

//#endregion

const jsonTest1 = {
  "Variable1":"val1",
  "Variable2":"val2",
}
const jsonTest2 = {
  
  "org_name": "Paradise Island",
  "daughters": [
    {
      
      "daughters": []
    }]
}


const jsonTest3 = {
  "org_name": "Paradise Island",
  "daughters": [
    {
      "org_name": "Banana tree",
      "daughters": [
        {
          "org_name": "Yellow Banana"
        },
        {
          "org_name": "Brown Banana"
        },
        {
          "org_name": "Black Banana"
        }
      ]
    },
    {
      "org_name": "Big banana tree",
      "daughters": [
        {
          "org_name": "Yellow Banana"
        },
        {
          "org_name": "Brown Banana"
        },
        {
          "org_name": "Green Banana"
        },
        {
          "org_name": "Black Banana",
          "daughters": [
            {
              "org_name": "Phoneutria Spider"
            }
          ]
        }
      ]
    }
  ]
}

//#region Tests Endpoint 2
describe('Endpoint 2 - POST ', () => {


  test('Should verify if json is in the correct format - Completely different format', async () => {
    const result = await request.post('/')
    .send(jsonTest1);
    const resultJSON = JSON.parse(result.text)
    expect(resultJSON.status_code).toBe(400);
    expect(resultJSON.status_message).toBe("JSON is not in the correct format.");
  }),

  test('Should verify if json is in the correct format v2 - Missing required value organisation name', async () => {
    const result = await request.post('/')
    .send(jsonTest2);
    const resultJSON = JSON.parse(result.text)
    expect(resultJSON.status_code).toBe(400);
    expect(resultJSON.status_message).toBe("JSON is not in the correct format.");
  }),



  test('Should insert README example', async () => {
    const result = await request.post('/')
    .send(jsonTest3);
    const resultJSON = JSON.parse(result.text)
    expect(resultJSON.status_code).toBe(200);
    expect(resultJSON.status_message).toBe("OK");
  })

});
//#endregion