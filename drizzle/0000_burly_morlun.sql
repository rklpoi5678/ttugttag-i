CREATE TABLE `UserProjects` (
	`id` text PRIMARY KEY NOT NULL,
	`clerkUserId` text NOT NULL,
	`projectName` text NOT NULL,
	`projectDescription` text,
	`tldrawContent` text NOT NULL,
	`screenSize` text,
	`canvas_width` integer,
	`canvas_height` integer,
	`projectType` text,
	`tags` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP
);
