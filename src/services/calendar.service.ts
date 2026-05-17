import { createSupabaseClient } from "@/lib/supabase/client";
import { NexusCalendarEvent } from "@/types/calendar";

type SupabaseCalendarEventRow = {
  id: string;
  user_id: string;
  title: string;
  start_at: string;
  end_at: string | null;
  created_at: string;
  updated_at: string;
};

type CalendarEventInput = Omit<NexusCalendarEvent, "id">;

function mapCalendarEventFromRow(
  row: SupabaseCalendarEventRow,
): NexusCalendarEvent {
  return {
    id: row.id,
    title: row.title,
    start: row.start_at,
    end: row.end_at ?? undefined,
  };
}

export async function getCalendarEvents() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("start_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    mapCalendarEventFromRow(row as SupabaseCalendarEventRow),
  );
}

export async function createCalendarEvent(event: CalendarEventInput) {
  const supabase = createSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to create a calendar event.");
  }

  const { data, error } = await supabase
    .from("calendar_events")
    .insert({
      user_id: user.id,
      title: event.title,
      start_at: event.start,
      end_at: event.end ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCalendarEventFromRow(data as SupabaseCalendarEventRow);
}

export async function updateCalendarEventById(
  id: string,
  event: CalendarEventInput,
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("calendar_events")
    .update({
      title: event.title,
      start_at: event.start,
      end_at: event.end ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCalendarEventFromRow(data as SupabaseCalendarEventRow);
}

export async function deleteCalendarEventById(id: string) {
  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
}