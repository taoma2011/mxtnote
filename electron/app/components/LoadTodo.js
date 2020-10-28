import React, { useEffect } from "react";
import { GetAllTodos } from "../utils/db";

export default function LoadTodo(props) {
  // eslint-disable-next-line react/prop-types
  const { addTodos } = props;
  const handleTodo = (todos) => {
    //console.log('getting db todo', todos);
    addTodos(todos);
  };
  useEffect(() => {
    //console.log('loading db todo');
    GetAllTodos(handleTodo);
  });

  return <div />;
}
