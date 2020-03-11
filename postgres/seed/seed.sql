INSERT INTO users (name, email, entries, joined, pet, age) values ('Jessie', 'jessie@gmail.com', 5, '2020-01-01', 'cat', 32), 
('David', 'dave@yahoo.com', 7, '2020-02-01', 'dog', 34);
INSERT INTO login (hash, email) values ('$2a$10$vq7OMjyIlDU7Zj3rFKTIHuv6scSynqbQdDAWR9lreaU1uTC9fGOxK', 'jessie@gmail.com'), 
('$2a$10$vq7OMjyIlDU7Zj3rFKTIHuv6scSynqbQdDAWR9lreaU1uTC9fGOxK', 'dave@yahoo.com');

COMMIT;