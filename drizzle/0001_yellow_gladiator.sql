PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_UserProjects` (
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
	`imageUrl` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_UserProjects`("id", "clerkUserId", "projectName", "projectDescription", "tldrawContent", "createdAt", "updatedAt", "screenSize", "projectType", "tags", "imageUrl") SELECT "id", "clerkUserId", "projectName", "projectDescription", "tldrawContent", "createdAt", "updatedAt", "screenSize", "projectType", "tags", "imageUrl" FROM `UserProjects`;--> statement-breakpoint
DROP TABLE `UserProjects`;--> statement-breakpoint
ALTER TABLE `__new_UserProjects` RENAME TO `UserProjects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;