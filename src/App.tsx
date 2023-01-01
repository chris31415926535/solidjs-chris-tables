import { Component, createSignal } from 'solid-js';
import { faker } from '@faker-js/faker';
import { ChrisTable, ChrisTableBootstrap } from './ChrisTable';
import {Container, Tab, Tabs} from 'solid-bootstrap';
//import fakedata from './fakedata.js'

function makeFakeData() {
  let fakedata = [];
  for (let i=0; i < 500; i++){
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
        <Container>
        <h1>Fast, Fancy, Searchable, Sortable, and Paginated Tables in SolidJS</h1>

        <button name="button-newdata" id="button-newdata" onClick={() => setData(makeFakeData())}>Generate new data</button>
        
        <Tabs defaultActiveKey="bootstrap-table" id="sample-tabs"> 
          <Tab eventKey="About" title="About">
          <div><p>
          This is a working example of a generic table-making function in SolidJS. It uses bootstrap (optionally) and otherwise has no dependinces beyond solid-js.</p>
          <p>Features:</p>
          <ul>
            <li>Pagination (defaults to 10 items per page, adjustable with code options)</li>
            <li>Searching/filtering</li>
            <li>Handles changing input data properly</li>
            <li>Choose some or all columns</li>
            <li>Customizable column headers</li>
            <li>Click column headings to sort, with fun indicators</li>
            <li>Customizable page size</li>
          </ul>
          <p>Things that could be better:</p>
          <li>Dynamic customizable page sizes</li>
          <li>Customizable table ids and/or classes for styling?</li>
          <li>Column widths can jump around when sorting/paging</li>
          </div>
          </Tab>
          <Tab eventKey="bootstrap-table" title="Bootstrap Table">

            <ChrisTableBootstrap data={getData()} verbose={true} options={{columnNames: ["Name!!", "Favourite Colour", "Job Description"]}} />
          </Tab>

          <Tab eventKey="boring-table" title="Boring Table">
            <ChrisTable data={getData()} options={{pageSize: 20, columnNames: ["Name!!", "Favourite Colour", "Job Description"]} }/>
          </Tab>
        </Tabs>
        </Container>
        );
      };
      
      export default App;
