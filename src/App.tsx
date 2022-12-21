import { Component, createSignal } from 'solid-js';
import { faker } from '@faker-js/faker';
import logo from './logo.svg';
import styles from './App.module.css';
import { ChrisTable } from './ChrisTable';
import { searchForWorkspaceRoot } from 'vite';

let fakedata = [];
for (let i=0; i < 100; i++){
fakedata.push(
  {
    name: faker.name.fullName(),
    favColour: faker.color.human(),
    job: faker.company.catchPhrase()
  }
)

}

let [getData, setData] = createSignal(fakedata);

const App: Component = () => {
  return (
    <div>
      <ChrisTable data={getData()} />
    </div>
  );
};

export default App;
