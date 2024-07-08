// @ts-ignore
import chalkTable from 'chalk-table';
import { User } from '../entities/user';

const tableOptions = {
  leftPad: 2,
  columns: [
    { field: "id", name: 'ID' },
    { field: 'login', name: 'LOGIN' },
    { field: 'name', name: 'NAME' },
    { field: 'email', name: 'EMAIL' },
    { field: 'location', name: 'LOCATION' },
    { field: 'isPro', name: 'PRO' },
    { field: 'languages', name: 'LANGUAGES' }
  ]
};

export function printUsers(users: User[]): void {
  const table = chalkTable(tableOptions, users);
  console.log(table);
}