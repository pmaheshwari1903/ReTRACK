/**
 * Pinecone vector operations for repository codebase sync.
 */

import type { CodeChunk } from "@/features/reviews/types/review";

import { getPineconeClient } from "@/features/pinecone/client";

const UPSERT_BATCH_SIZE = 90;

/**
 * Builds the Pinecone namespace for a repository.
 */
export function buildRepoNamespace(repoFullName: string) {
  return `${repoFullName.replace("/", "--")}--codebase`;
}

/**
 * Deletes all vectors for a repository namespace.
 */
export async function deleteRepoNamespace(namespace: string) {
  const index = getPineconeClient();

  await index.deleteNamespace(namespace);
}

/**
 * Saves repository chunks into Pinecone.
 *
 * Empty chunks are filtered before they reach the
 * integrated embedding model.
 */
export async function saveRepoChunks(
  namespace: string,
  chunks: CodeChunk[]
) {
  const index = getPineconeClient();

  for (
    let start = 0;
    start < chunks.length;
    start += UPSERT_BATCH_SIZE
  ) {
    const batch = chunks.slice(
      start,
      start + UPSERT_BATCH_SIZE
    );

    const records = batch
      .filter(
        (chunk) =>
          typeof chunk.text === "string" &&
          chunk.text.trim().length > 0
      )
      .map((chunk) => ({
        id: chunk.id,
        text: chunk.text.trim(),
        filePath: chunk.filePath,
      }));

    // Never send an empty records array to Pinecone.
    if (records.length === 0) {
      continue;
    }

    await index.namespace(namespace).upsertRecords({
      records,
    });
  }
}