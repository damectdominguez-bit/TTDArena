alter table public.workouts
add column if not exists display_order integer;

with ordered as (
  select
    id,
    workout_date,
    row_number() over (
      partition by workout_date
      order by coalesce(display_order, 2147483647), id
    ) - 1 as next_display_order
  from public.workouts
)
update public.workouts as workouts
set display_order = ordered.next_display_order
from ordered
where workouts.id = ordered.id
  and workouts.display_order is distinct from ordered.next_display_order;

update public.workouts
set display_order = 0
where display_order is null;

alter table public.workouts
alter column display_order set default 0;

alter table public.workouts
alter column display_order set not null;

create index if not exists workouts_workout_date_display_order_idx
on public.workouts (workout_date, display_order);
