import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJSON } from "./http.js";

// Live public stats from the GitHub REST API.
export const fetchGithubProfile = createAsyncThunk(
  "github/fetchProfile",
  async (username, { signal }) => {
    const user = await getJSON(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      signal,
      headers: { Accept: "application/vnd.github+json" },
    });
    return {
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      memberSince: new Date(user.created_at).getFullYear(),
      avatarUrl: user.avatar_url,
      url: user.html_url,
    };
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().github;
      return status !== "loading" && status !== "succeeded";
    },
  }
);

const githubSlice = createSlice({
  name: "github",
  initialState: { status: "idle", profile: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGithubProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGithubProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchGithubProfile.rejected, (state, action) => {
        // An aborted request is not a real failure; let the next mount retry.
        state.status = action.meta.aborted ? "idle" : "failed";
        state.error = action.error.message ?? "GitHub is not answering right now.";
      });
  },
});

export default githubSlice.reducer;

export const selectGithub = (state) => state.github;
