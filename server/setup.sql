create table if not exists actions (
	id integer primary key,
	timestamp text default CURRENT_TIMESTAMP,
	sector text,
	celda text,
	action text,
	data Text
);

create table if not exists terminalIds (
	id integer primary key,
	timestamp text default CURRENT_TIMESTAMP,
	ip text,
	ua text
);
