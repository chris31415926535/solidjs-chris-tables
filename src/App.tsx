import { Component, createSignal } from 'solid-js';
import { faker } from '@faker-js/faker';
import { ChrisTable, ChrisTableBootstrap } from './ChrisTable';
//import fakedata from './fakedata.js'

function makeFakeData() {
  let fakedata = [];
  for (let i=0; i < 100; i++){
    fakedata.push(
      {
        name: faker.name.fullName(),
        favColour: faker.color.human(),
        job: faker.company.catchPhrase()
      }
      )}
      return fakedata
    }

    //let fakedata = makeFakeData();
    
   // console.log(JSON.stringify(fakedata))
    
    let [getData, setData] = createSignal(makeFakeData());
    
    const App: Component = () => {
      return (
        <div>
        <button name="button-newdata" id="button-newdata" onClick={() => setData(makeFakeData())}>Generate new data</button>
        <ChrisTable data={getData()} />
        <hr/>
        <ChrisTableBootstrap data={getData()} />
        </div>
        );
      };
      
      export default App;
