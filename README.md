
This is my personal fork of KES (Kbin Enhancement Suite) for development purposes.

Work is being done in individual `mod/{mod-name}` branches, which are kept open for future changes to the mod.
The `tests` branch exists for automated tests and my own adjusted KES userscript which I use to test my changes.

# Issues

All my ideas for kbin (not just KES) are organized as issues on a [kanban board](https://github.com/users/Pamasich/projects/2).

Each issue has a `priority` label (low, medium, high), representing how needed the feature is, and an `effort` label 
(low, moderate, high), indicating how much work I expect it to be.

Generally a bugfix has a priority of medium or higher, while changes in KES's code or a third party mod are given an 
effort level of "moderate" as the minimum. This is because I'll have to put in time to understand the existing code 
first.

Many issues are also given an additional label to indicate what type of work they are: a new `mod`, a `feature` for an
existing one, or a `bugfix`.

When an issue is given the `requires-approval` label, it doesn't necessarily literally mean that. If I plan to do
something on KES itself or someone else's mod, I need to ensure they don't have non-committed code from having already
tackled the issue before. Also, my changes might go against their vision. So those issues I'll want to contact the code's
owner first, if they're still active.

# Planning Work

When I decide to tackle an issue, I move it to the `Planned` column of the board and write **two lists** as a comment on
the issue:

1. A list of actionable goals to achieve for now
2. What actions to take after completing all the aforementioned goals

This might look like the following example:

> Currently planned goals:
> 
> - Adjust the readme
>
> Then:
>
> - Close this issue

The goal here is to define goals for this specific partial task, not the entire issue. The *then* section doesn't just
need to be to close the issue, it can also be to plan how to proceed ahead if the issue isn't finished yet.