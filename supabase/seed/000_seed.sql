insert into companies (name) values ('Golffox Tech') on conflict do nothing;
insert into companies (name) values ('SynVolt Logistics') on conflict do nothing;

insert into carriers (name, company_id)
select 'TransFox', id from companies where name = 'Golffox Tech'
on conflict do nothing;

insert into drivers (name, phone)
values ('João Motorista', '(31) 99999-1111'), ('Carlos Freitas', '(31) 88888-2222')
on conflict do nothing;

insert into passengers (name, phone)
values ('Maria Lima', '(31) 99999-4444'), ('Lucas Silva', '(31) 97777-5555')
on conflict do nothing;

insert into vehicles (plate, capacity)
values ('ABC-1234', 30), ('XYZ-5678', 40)
on conflict do nothing;

insert into routes (name)
values ('Rota A - Centro'), ('Rota B - Industrial')
on conflict do nothing;

