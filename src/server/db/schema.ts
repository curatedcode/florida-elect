// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { zPartyAbbreviation } from "@/types";
import { zElections } from "@/types";
import { zStates } from "@/types/map";
import { sql } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTableCreator,
	real,
	text,
	varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `florida-elect_${name}`);

export const timestamps = (
	d: Parameters<Parameters<typeof createTable>[1]>[0],
) => ({
	createdAt: d
		.timestamp({ withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	deletedAt: d.timestamp({ withTimezone: true }),
});

export const districtState = pgEnum("district_state", zStates.options);

export const districts = createTable("districts", (d) => ({
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	state: districtState("state").notNull(),
	number: integer("number").notNull(),
	...timestamps(d),
}));

export const electionType = pgEnum("election_type", zElections.options);

export const elections = createTable("elections", (d) => ({
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	date: varchar({ length: 10 }).notNull(),
	districtId: integer("district_id")
		.references(() => districts.id)
		.notNull(),
	type: electionType("type").notNull(),
	...timestamps(d),
}));

export const results = createTable("results", (d) => ({
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	electionId: integer("election_id")
		.references(() => elections.id)
		.notNull(),
	districtId: integer("district_id")
		.references(() => districts.id)
		.notNull(),
	candidateId: integer("candidate_id")
		.references(() => candidates.id)
		.notNull(),
	votes: integer("votes").notNull(),
	voteShare: integer("vote_share").notNull(),
	winner: boolean("winner").notNull(),
	...timestamps(d),
}));

export const ageGroup = z.enum([
	"18-24",
	"25-34",
	"35-44",
	"45-54",
	"55-64",
	"65+",
]);

export const candidateParty = pgEnum("party", zPartyAbbreviation.options);

export const candidates = createTable(
	"candidates",
	(d) => ({
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		name: text("name").notNull(),
		image: text("image").notNull(),
		party: candidateParty("party").notNull(),
		...timestamps(d),
	}),
	(t) => [index("name_idx").on(t.name)],
);

export const contributors = createTable("contributors", (d) => ({
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	candidateId: integer("candidate_id")
		.references(() => candidates.id)
		.notNull(),
	name: text("name").notNull(),
	amount: real("amount").notNull(),
	latestDate: text("latest_date").notNull(),
	earliestDate: text("earliest_date").notNull(),
	count: integer("count").notNull(),
	...timestamps(d),
}));

export const posts = createTable("post", (d) => ({
	id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
	name: d.varchar({ length: 256 }),
	...timestamps(d),
}));
