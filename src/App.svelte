<script lang="ts">
  import { onMount } from 'svelte'
  import { apiClient } from './api'
  import type { TodoItem } from './api/api.client'
  import { isErrorFromAlias } from '@zodios/core'
  import { ZodError } from 'zod'

  let newTodoTitle = ''
  let todos: TodoItem[] = []

  function addTodo() {
    apiClient
      .createTodo({
        title: newTodoTitle,
      })
      .then((res) => {
        todos = [...todos, res]
        newTodoTitle = ''
      })
      .catch((err) => {
        if (isErrorFromAlias(apiClient.api, 'createTodo', err)) {
          alert(`Error: ${err.response.data.message}`)
        } else if (err.cause instanceof ZodError) {
          alert(err.cause.errors[0].message)
        } else {
          console.log('Error', err)
        }
      })
  }

  function toggleTodoCompleted(todo: TodoItem) {
    const completed = !todo.completed
    apiClient
      .updateTodoById(
        {
          completed,
        },
        {
          params: {
            id: todo.id,
          },
        }
      )
      .then(() => {
        todos = todos.map((t) => {
          if (t.id === todo.id) {
            return {
              ...t,
              completed,
            }
          }
          return t
        })
      })
      .catch((err) => {
        if (isErrorFromAlias(apiClient.api, 'updateTodoById', err)) {
          alert(`Error: ${err.response.data.message}`)
        } else if (err.cause instanceof ZodError) {
          alert(err.cause.errors[0].message)
        } else {
          console.log('Error', err)
        }
      })
  }

  function removeTodo(todo: TodoItem) {
    apiClient
      .deleteTodoById(null, {
        params: {
          id: todo.id,
        },
      })
      .then(() => {
        todos = todos.filter((t) => t.id !== todo.id)
      })
      .catch((err) => {
        if (isErrorFromAlias(apiClient.api, 'deleteTodoById', err)) {
          alert(`Error: ${err.response.data.message}`)
        } else if (err.cause instanceof ZodError) {
          alert(err.cause.errors[0].message)
        } else {
          console.log('Error', err)
        }
      })
  }

  $: activeTodoCount = todos.filter((todo) => !todo.completed).length

  onMount(() => {
    apiClient
      .getAllTodos()
      .then((res) => {
        todos = res
      })
      .catch((err) => {
        console.log('Error', err)
      })
  })
</script>

<div
  class="flex min-h-screen w-screen items-center justify-center overflow-x-hidden bg-gray-100"
>
  <div class="mx-auto my-8 w-[42rem] rounded-xl bg-white p-8">
    <h1 class="mb-8 text-4xl font-bold">Todo App</h1>
    <form class="mb-8" on:submit|preventDefault={addTodo}>
      <input
        bind:value={newTodoTitle}
        class="w-full rounded-md border-gray-300 p-2 shadow-sm"
        placeholder="What needs to be done?"
      />
    </form>
    <ul class="mb-8">
      <li
        class="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0"
      >
        <div>#</div>
        <div />
        <div />
      </li>

      {#each todos as todo (todo.id)}
        <li
          class="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0"
        >
          <label>
            <span>{todo.id}</span>
            <input
              type="checkbox"
              class="mr-4"
              checked={todo.completed}
              on:click|preventDefault={() => toggleTodoCompleted(todo)}
            />
            <span class={todo.completed && 'line-through'}>{todo.title}</span>
          </label>
          <button
            class="text-gray-400 hover:text-gray-600"
            on:click={() => removeTodo(todo)}
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </li>
      {/each}
    </ul>
    <div class="flex items-center text-sm text-gray-500">
      <span>{activeTodoCount} item(s) left</span>
    </div>
  </div>
</div>
