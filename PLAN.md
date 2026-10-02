subjects

- id (primary key)
- name (text, unique)
- created_at

sessions

- id (primary key)
- subject_id (subjects.id-এর foreign key)
- minutes (integer)
- studied_on (date)
- note (text, optional)
- created_at
