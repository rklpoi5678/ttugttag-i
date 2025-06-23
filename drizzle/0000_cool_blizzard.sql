CREATE TABLE `UserProjects` (
	`id` text PRIMARY KEY NOT NULL,
	`clerkUserId` text NOT NULL,
	`projectName` text NOT NULL,
	`projectDescription` text,
	`tldrawContent` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP,
	`screenSize` text,
	`projectType` text,
	`tags` text,
	`imageUrl` text
);
