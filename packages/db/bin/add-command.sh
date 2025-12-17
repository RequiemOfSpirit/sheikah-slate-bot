#!/bin/bash
# Temp script to add commands to db. Will remove after backend module has this functionality implemented.

if [ -z "$DATABASE_URL" ]; then
  echo -e "\033[1;31mError: DATABASE_URL is not defined\033[0m"
  exit 1
fi

while true; do
  read -p "> Enter command title: " RESOURCE_TITLE
  read -p "> Enter response content for command (no newlines): " RESOURCE_CONTENT
  RESOURCE_CONTENT=$(echo "$RESOURCE_CONTENT" | sed "s/'/''/g") # Escape single quotes for SQL

  # Insert into resources table
  RESOURCE_ID=$(psql "$DATABASE_URL" -t -c "INSERT INTO resources (title, content) VALUES ('$RESOURCE_TITLE', '$RESOURCE_CONTENT') RETURNING id;" | head -n 1 | xargs)
  if [ -z "$RESOURCE_ID" ]; then
    echo -e "\033[1;31mError: Failed to insert into resources table\033[0m"
    exit 1
  fi
  echo -e "\033[1;32mInserted resource with ID: $RESOURCE_ID\033[0m"

  while true; do
    read -p "> Enter command id/alias id: " COMMAND_NAME

    # Insert into commands table
    COMMAND_ID=$(psql "$DATABASE_URL" -t -c "INSERT INTO commands (name, resource_id) VALUES ('$COMMAND_NAME', '$RESOURCE_ID') RETURNING id;" | head -n 1 | xargs)
    if [ -z "$COMMAND_ID" ]; then
      echo -e "\033[1;31mError: Failed to insert into commands table\033[0m"
      exit 1
    fi
    echo -e "\033[1;32mInserted command with ID: $COMMAND_ID\033[0m"

    read -p "> Do you want to add another command ID/alias? (y/N): " NEW_ALIAS
    if [[ "$NEW_ALIAS" != "y" && "$NEW_ALIAS" != "Y" ]]; then
      break
    fi
  done

  read -p "> Do you want to add another command? (y/N): " NEW_COMMAND
  if [[ "$NEW_COMMAND" != "y" && "$NEW_COMMAND" != "Y" ]]; then
    break
  fi
done
